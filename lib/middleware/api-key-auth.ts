import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export interface ApiKeyValidationResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export interface AuthenticatedRequest extends NextRequest {
  apiKeyData?: {
    orderId: string;
    orderNumber: string;
    metadata: Record<string, any>;
  };
}

/**
 * Middleware to validate API key for TikTok order endpoints
 * Returns validation result and sets request data if successful
 */
export async function validateApiKey(
  request: NextRequest,
): Promise<ApiKeyValidationResult> {
  try {
    // Extract API key from header
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return {
        success: false,
        error: "API key is required. Please verify your order first.",
      };
    }

    // Verify API key with better-auth
    const verification = await auth.api.verifyApiKey({
      body: {
        key: apiKey,
      },
    });

    if (!verification.valid || !verification.key) {
      return {
        success: false,
        error: "Invalid or expired API key. Please verify your order again.",
      };
    }

    const keyData = verification.key;

    // Validate metadata
    const metadata = keyData.metadata;
    if (!metadata?.orderId || !metadata?.orderNumber) {
      return {
        success: false,
        error: "Invalid session data. Please verify your order again.",
      };
    }

    // Validate permissions for TikTok operations
    const permissions = keyData.permissions;
    if (!permissions?.tiktokOrder) {
      return {
        success: false,
        error: "Insufficient permissions for this operation.",
      };
    }

    console.log(`✅ API key validated for TikTok order ${metadata.orderId}`);

    return {
      success: true,
      orderId: metadata.orderId,
      orderNumber: metadata.orderNumber,
    };
  } catch (error) {
    console.error("API key validation error:", error);
    return {
      success: false,
      error: "Authentication failed. Please try again.",
    };
  }
}

/**
 * Higher-order function to protect API routes with API key authentication
 */
export function withApiKeyAuth<T extends any[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const validation = await validateApiKey(request);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 401 },
      );
    }

    // Add API key data to request for use in handler
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.apiKeyData = {
      orderId: validation.orderId!,
      orderNumber: validation.orderNumber!,
      metadata: {}, // Can be expanded as needed
    };

    return handler(authenticatedRequest, ...args);
  };
}

/**
 * CORS headers for TikTok form domain
 */
export function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = [
    process.env.TIKTOK_FORM_DOMAIN,
    "http://localhost:5173", // Vite dev server
    "http://localhost:3000", // Next.js dev server
  ].filter(Boolean);

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin
      ? origin
      : allowedOrigins[0] || "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Access-Control-Max-Age": "86400", // 24 hours
  };
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function handleCorsOptions(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin || undefined);

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

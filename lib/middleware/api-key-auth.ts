import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export interface ApiKeyValidationResult {
  success: boolean;
  keyId?: string;
  error?: string;
}

export interface AuthenticatedRequest extends NextRequest {
  apiKeyData?: {
    keyId: string;
    metadata: Record<string, unknown>;
  };
}

/**
 * Validates a better-auth API key from the `x-api-key` request header.
 * Use this for protecting integration endpoints that need key-based auth
 * without requiring a user session.
 */
export async function validateApiKey(
  request: NextRequest,
): Promise<ApiKeyValidationResult> {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return {
        success: false,
        error: "API key is required.",
      };
    }

    const verification = await auth.api.verifyApiKey({
      body: { key: apiKey },
    });

    if (!verification.valid || !verification.key) {
      return {
        success: false,
        error: "Invalid or expired API key.",
      };
    }

    return {
      success: true,
      keyId: verification.key.id,
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
 * Higher-order function to protect API routes with API key authentication.
 *
 * @example
 * export const POST = withApiKeyAuth(async (req) => {
 *   const { keyId } = req.apiKeyData!;
 *   return NextResponse.json({ ok: true });
 * });
 */
export function withApiKeyAuth<T extends unknown[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const validation = await validateApiKey(request);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 401 },
      );
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.apiKeyData = {
      keyId: validation.keyId!,
      metadata: {},
    };

    return handler(authenticatedRequest, ...args);
  };
}

/**
 * CORS headers for API key protected routes.
 * Configure ALLOWED_ORIGINS via environment variables as needed.
 */
export function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN,
    "http://localhost:5173",
    "http://localhost:3000",
  ].filter(Boolean) as string[];

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin
      ? origin
      : allowedOrigins[0] || "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Handle OPTIONS preflight requests for CORS.
 */
export function handleCorsOptions(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin || undefined),
  });
}

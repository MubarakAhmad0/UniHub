import { NextRequest, NextResponse } from "next/server";
import { validateTikTokSession } from "@/lib/tiktok-session";

export interface SessionValidationResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export interface AuthenticatedRequest extends NextRequest {
  sessionData?: {
    orderId: string;
    orderNumber: string;
  };
}

/**
 * Middleware to validate session token for TikTok order endpoints
 * Returns validation result and sets request data if successful
 */
export async function validateSessionToken(
  request: NextRequest,
): Promise<SessionValidationResult> {
  try {
    // Extract session token from header
    const sessionToken = request.headers.get("x-session-token");

    if (!sessionToken) {
      return {
        success: false,
        error: "Session token is required. Please verify your order first.",
      };
    }

    // Verify session token
    const session = await validateTikTokSession(sessionToken);

    if (!session.valid) {
      return {
        success: false,
        error:
          "Invalid or expired session token. Please verify your order again.",
      };
    }

    console.log(
      `✅ Session token validated for TikTok order ${session.orderId}`,
    );

    return {
      success: true,
      orderId: session.orderId!,
      orderNumber: session.orderNumber!,
    };
  } catch (error) {
    console.error("Session token validation error:", error);
    return {
      success: false,
      error: "Authentication failed. Please try again.",
    };
  }
}

/**
 * Higher-order function to protect API routes with session token authentication
 */
export function withSessionAuth<T extends any[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const validation = await validateSessionToken(request);

    if (!validation.success) {
      const origin = request.headers.get("origin");
      const corsHeaders = getCorsHeaders(origin || undefined);

      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    // Add session data to request for use in handler
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.sessionData = {
      orderId: validation.orderId!,
      orderNumber: validation.orderNumber!,
    };

    return handler(authenticatedRequest, ...args);
  };
}

/**
 * CORS headers for TikTok form domains
 */
export function getCorsHeaders(origin?: string): Record<string, string> {
  // Support comma-separated list of domains in TIKTOK_FORM_DOMAIN
  const tiktokDomains = process.env.TIKTOK_FORM_DOMAIN
    ? process.env.TIKTOK_FORM_DOMAIN.split(",").map((domain) => domain.trim())
    : [];

  const allowedOrigins = [
    ...tiktokDomains,
    "http://localhost:5173", // Vite dev server
    "http://localhost:3000", // Next.js dev server
  ].filter(Boolean);

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin
      ? origin
      : allowedOrigins[0] || "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-session-token",
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

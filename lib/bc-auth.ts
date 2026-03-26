// Business Central OAuth2 Authentication
import { BC_CONFIG } from "@/app/api/bc/_lib/config";

interface BCAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

export async function getBCAuthToken(): Promise<string> {
  // Return cached token if still valid (with 5 minute buffer)
  const now = Date.now();
  if (cachedToken && now < tokenExpiryTime - 5 * 60 * 1000) {
    return cachedToken;
  }

  try {
    const tokenUrl = BC_CONFIG.TOKEN_ENDPOINT(BC_CONFIG.TENANT_ID!);

    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: BC_CONFIG.CLIENT_ID!,
      client_secret: BC_CONFIG.CLIENT_SECRET!,
      scope: BC_CONFIG.API_SCOPE,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OAuth2 token request failed (${response.status}): ${errorText}`,
      );
    }

    const authResponse: BCAuthResponse = await response.json();

    // Cache the token
    cachedToken = authResponse.access_token;
    tokenExpiryTime = now + authResponse.expires_in * 1000;

    return authResponse.access_token;
  } catch (error) {
    console.error("BC Auth Error:", error);
    throw new Error(
      `Failed to get BC auth token: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

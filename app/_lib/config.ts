export const appConfig = {
  staging: {
    secretName: "placeholder",
  },
  production: {
    secretName: "placeholder",
  },
};

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost",
]
  .filter(Boolean)
  .join(", ");

export function getCorsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };
}

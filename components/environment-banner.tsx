// server component by default (removed "use client")
import { headers } from "next/headers";

const EnvironmentBanner = async () => {
  // get host from headers instead of window.location
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isProdDomain = process.env.NODE_ENV === "production";

  // check if we're using prod db - this now runs on server
  const isProdDb =
    process.env.DB_URL?.includes("ap-southeast-1.rds.amazonaws.com") ?? false;

  // only render banner if we're not on prod domain but using prod db
  if (!(!isProdDomain && isProdDb)) return null;

  return (
    <div className="absolute top-0 z-50 bg-yellow-500 px-4 text-center font-medium text-yellow-950 right-0 text-xs">
      ⚠️ Warning: You are using a production database in a local environment
    </div>
  );
};

export default EnvironmentBanner;

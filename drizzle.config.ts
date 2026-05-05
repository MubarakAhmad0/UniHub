import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

const getDbUrl = () => {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) return "";

  if (dbUrl.includes("sslmode=")) return dbUrl;
  const separator = dbUrl.includes("?") ? "&" : "?";
  return `${dbUrl}${separator}sslmode=require`;
};

export default defineConfig({
  schema: "./db/schema/**/*.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: getDbUrl(),
  },
});

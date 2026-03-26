import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

import { appConfig } from "@/app/_lib/config";

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Define the shape of secrets stored in AWS Secrets Manager
type AppSecret = {
  DATABASE_URL: string;
  // Add other secret fields here as needed
};

export const getSecret = async () => {
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId:
        process.env.APP_ENV === "production"
          ? appConfig.production.secretName
          : appConfig.staging.secretName,
    }),
  );

  if (!response.SecretString) {
    throw new Error(`Secret not found or empty`);
  }

  const secrets: AppSecret = JSON.parse(response.SecretString);
  return secrets;
};

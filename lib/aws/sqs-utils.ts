import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface SQSPublishResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Generic SQS message publisher.
 * Replace the payload type and queue URL env variable to match your use case.
 */
export const publishMessage = async <T>(
  queueUrlEnvKey: string,
  payload: T,
): Promise<SQSPublishResult> => {
  const queueUrl = process.env[queueUrlEnvKey];

  if (!queueUrl) {
    console.error(`${queueUrlEnvKey} environment variable not set`);
    return { success: false, error: `${queueUrlEnvKey} not set` };
  }

  try {
    const command: SendMessageCommandInput = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
    };

    const result = await sqsClient.send(new SendMessageCommand(command));
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error("Error publishing SQS message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { format } from "date-fns";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string,
  date: Date,
) {
  try {
    // Format date as YYYY/MM/DD
    const datePath = format(date, "yyyy/MM/dd");
    // Create key path: folder/YYYY/MM/DD/filename
    const key = `${folder}/${datePath}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

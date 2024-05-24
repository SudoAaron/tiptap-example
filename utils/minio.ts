import * as Minio from "minio";

export const s3Client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT as string,
  port: process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined,
  useSSL: process.env.S3_USE_SSL === "true",
  accessKey: process.env.S3_ACCESS_KEY as string,
  secretKey: process.env.S3_SECRET_KEY as string,
});

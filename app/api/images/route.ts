import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/utils/minio";
import { Readable } from "stream";

export async function POST(request: NextRequest, response: NextResponse) {
  "use server";

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (file.size) {
    try {
      const ssl = process.env.S3_USE_SSL ? "http://" : "https://";
      console.log("ssl:", ssl);

      const bucketName = process.env.S3_BUCKET_NAME as string;
      const fileName = file?.name;
      const extension = fileName?.split(".").pop();
      let imageName = `${Date.now()}.${extension ?? "jpg"}`;
      const readStream = Readable.from(Buffer.from(await file.arrayBuffer()));

      const upload = await s3Client.putObject(
        bucketName,
        imageName,
        readStream
      );

      const s3Port = process.env.S3_PORT ? ":" + process.env.S3_PORT : "";
      const url =
        ssl +
        process.env.S3_ENDPOINT +
        s3Port +
        "/" +
        bucketName +
        "/" +
        imageName;

      return NextResponse.json(
        { message: "File uploaded successfully", url: url },
        { status: 200 }
      );
    } catch (e) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  "use server";

  const data = await request.json();
  const imageURL = data.url;

  // Parse the URL to extract the image name
  const parsedUrl = new URL(imageURL);
  const imageName = parsedUrl.pathname.split("/").pop();

  if (!imageName) {
    return new Response(JSON.stringify({ error: "Image name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const bucketName = process.env.S3_BUCKET_NAME as string;

    // Delete object from S3 bucket
    await s3Client.removeObject(bucketName, imageName);

    return NextResponse.json(
      { message: "Image deleted successfully", imageName: imageName },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

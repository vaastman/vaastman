import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import sharp from "sharp";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB max upload size
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG and WebP are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        },
        { status: 400 },
      );
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`Original size: ${(buffer.length / 1024).toFixed(2)}KB`);

    // Process image locally with sharp
    // 1. Resize to max 600x600 (Perfect for passport/profile photos which are usually displayed small)
    // 2. Convert to WebP
    // 3. Reduce image quality to 75 for better compression
    const optimizedBuffer = await sharp(buffer)
      .resize(600, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toBuffer();

    console.log(
      `Optimized (local) size: ${(optimizedBuffer.length / 1024).toFixed(2)}KB`,
    );

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "Vaastman_solution",
            // We already processed the image, so no need for heavy Cloudinary transformations
            // just ensure it's stored as the format we sent (webp)
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          },
        )
        .end(optimizedBuffer);
    });

    // console.log("Upload result:", result)
    console.log(
      `Final Cloudinary size: ${((result as any).bytes / 1024).toFixed(2)}KB`,
    );

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      format: (result as any).format,
      width: (result as any).width,
      height: (result as any).height,
      bytes: (result as any).bytes,
      originalSize: buffer.length,
      compression: {
        originalSize: `${(buffer.length / 1024).toFixed(2)}KB`,
        optimizedSize: `${(optimizedBuffer.length / 1024).toFixed(2)}KB`,
        finalSize: `${((result as any).bytes / 1024).toFixed(2)}KB`,
        saved: `${((buffer.length - (result as any).bytes) / 1024).toFixed(2)}KB`,
        format: (result as any).format,
      },
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

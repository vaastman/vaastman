import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import sharp from "sharp";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max upload size
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string | null) ?? "profile";

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed.",
        },
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Profile photo: 800x800 max inside (crisp passport/avatar)
    // Aadhar / Document: 1400x1400 max inside (keeps small text and document details razor sharp)
    const isAadhar = type === "aadhar";
    const maxWidth = isAadhar ? 1400 : 800;
    const maxHeight = isAadhar ? 1400 : 800;
    const quality = isAadhar ? 80 : 75;

    // Fast local compression with sharp:
    // 1. .rotate() auto-orients based on EXIF tag (phone cameras)
    // 2. .resize() fit inside, without enlargement
    // 3. .webp() with effort 3 for instant compression (<50ms) and tiny payload (<80KB)
    const optimizedBuffer = await sharp(buffer)
      .rotate()
      .resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 3 })
      .toBuffer();

    // Stream optimized buffer to Cloudinary
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "Vaastman_solution",
          format: "webp",
        },
        (error, res) => {
          if (error) {
            reject(error);
            return;
          }
          if (res) {
            resolve(res as any);
          } else {
            reject(new Error("Cloudinary returned empty result."));
          }
        },
      );
      uploadStream.end(optimizedBuffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      originalSize: buffer.length,
      optimizedSize: optimizedBuffer.length,
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error uploading image",
      },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

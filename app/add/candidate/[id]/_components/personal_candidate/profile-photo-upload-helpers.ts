export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MAX_PROFILE_PHOTO_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type UploadResponse = {
  url?: string;
  error?: string;
  success?: boolean;
};

export function isAcceptedImageType(file: File): boolean {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

export function isWithinProfilePhotoSizeLimit(file: File): boolean {
  return file.size <= MAX_PROFILE_PHOTO_FILE_SIZE;
}

export async function uploadProfilePhoto(
  file: File,
  type: "profile" | "aadhar" = "profile",
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await fetch("/api/img", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as UploadResponse;

  if (!response.ok || !result.url) {
    throw new Error(result.error || "Image upload failed.");
  }

  return result.url;
}

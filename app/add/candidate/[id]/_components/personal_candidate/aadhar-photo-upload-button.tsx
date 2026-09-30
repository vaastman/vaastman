import { InputGroupButton } from "@/components/ui/input-group";
import { LoadingSwap } from "@/components/ui/loading-swap";

export function AadharPhotoUploadButton({
  isUploading,
  hasSelectedFile,
  onUpload,
}: {
  isUploading: boolean;
  hasSelectedFile: boolean;
  onUpload: () => Promise<void>;
}) {
  return (
    <InputGroupButton
      aria-label="Upload selected aadhar image"
      disabled={!hasSelectedFile || isUploading}
      onClick={onUpload}
      size="xs"
      variant="default"
    >
      <LoadingSwap isLoading={isUploading}>Upload</LoadingSwap>
    </InputGroupButton>
  );
}

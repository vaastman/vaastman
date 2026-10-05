import { IconEyeFilled } from "@tabler/icons-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputGroupButton } from "@/components/ui/input-group";

export function AadharPhotoPreviewButton({
  previewUrl,
}: {
  previewUrl: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <InputGroupButton
          aria-label="Preview uploaded aadhar"
          variant="default"
        >
          <IconEyeFilled className="size-5" data-icon="inline-start" />
          Preview
        </InputGroupButton>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg!">Aadhar Preview</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="relative aspect-4/3 sm:aspect-video w-full max-w-md overflow-hidden rounded-2xl border bg-muted/50">
            <Image
              alt="Candidate aadhar preview"
              fill
              className="object-contain p-1"
              sizes="(max-width: 640px) 90vw, 450px"
              src={previewUrl}
              unoptimized
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

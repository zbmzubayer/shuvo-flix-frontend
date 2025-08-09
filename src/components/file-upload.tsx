'use client';

import { ImageUpIcon, XIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import type { FileWithPreview } from '@/hooks/use-file-upload';

interface FileUploadProps {
  label?: string;
  files: FileWithPreview[];
  openFileDialog: () => void;
  removeFile: (id: string) => void;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
}
export function FileUpload({
  label,
  files,
  openFileDialog,
  removeFile,
  getInputProps,
}: FileUploadProps) {
  const previewUrl = files[0]?.preview || null;
  // const fileName = files[0]?.file.name || null;

  return (
    <div className="inline-flex flex-col gap-2">
      {label && (
        <label className="font-medium text-sm" htmlFor="file">
          {label}
        </label>
      )}
      <div className="relative inline-flex">
        <Button
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
          className="relative size-16 overflow-hidden p-0 shadow-none"
          onClick={openFileDialog}
          type="button"
          variant="outline"
        >
          {previewUrl ? (
            <Image
              alt="Preview of uploaded image"
              className="size-full object-cover"
              height={64}
              src={previewUrl}
              style={{ objectFit: 'cover' }}
              width={64}
            />
          ) : (
            <div aria-hidden="true">
              <ImageUpIcon className="size-6 opacity-60" />
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            aria-label="Remove image"
            className="-top-2 -right-2 absolute size-5 rounded-full border border-destructive shadow-none focus-visible:border-destructive"
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
            type="button"
          >
            <XIcon className="size-3.5 text-destructive" />
          </Button>
        )}
        <input
          id="file"
          {...getInputProps()}
          aria-label="Upload image file"
          className="sr-only"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";

interface DocumentPreviewProps {
  document: {
    cloudinary_url: string;
    mime_type: string;
    original_name: string;
  };
  onSuccess: () => void;
}

export default function DocumentPreview({
  document,
  onSuccess,
}: DocumentPreviewProps) {
  const handleClose = () => {
    onSuccess();
  };

  const renderPreview = () => {
    const { mime_type, cloudinary_url, original_name } = document;

    if (mime_type.startsWith("image/")) {
      return (
        <div className="relative w-full h-[80vh]">
          <Image
            src={cloudinary_url}
            alt={original_name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      );
    }

    if (mime_type.startsWith("audio/")) {
      return (
        <audio controls className="w-full">
          <source src={cloudinary_url} type={mime_type} />
          Your browser does not support the audio element.
        </audio>
      );
    }

    if (mime_type.startsWith("video/")) {
      return (
        <video controls className="max-w-full max-h-[70vh] rounded-md mx-auto">
          <source src={cloudinary_url} type={mime_type} />
          Your browser does not support the video element.
        </video>
      );
    }

    if (mime_type === "application/pdf") {
      return (
        <iframe
          src={cloudinary_url}
          title={original_name}
          className="w-full h-screen"
        />
      );
    }

    return (
      <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
        <p>No preview available for this file type.</p>

        <a
          href={cloudinary_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Download {original_name}
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 max-md:px-4 w-full h-full">
      {renderPreview()}
    </div>
  );
}

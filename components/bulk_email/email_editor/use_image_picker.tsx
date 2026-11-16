"use client";

import { useRef } from "react";
import { useUploadEmailImage } from "@/hooks/bulk_email/images";
import { EMAIL_IMAGE_ACCEPT } from "@/services/bulk_email/images";

// Opens the device file picker, uploads the chosen image to POST /email-images
// and hands back its public URL. Render `input` once wherever the hook is used.
export function useImagePicker(onUploaded: (url: string) => void) {
	const inputRef = useRef<HTMLInputElement>(null);
	const upload = useUploadEmailImage();

	const input = (
		<input
			ref={inputRef}
			type="file"
			accept={EMAIL_IMAGE_ACCEPT}
			hidden
			onChange={(e) => {
				const file = e.target.files?.[0];
				e.target.value = "";
				if (file) upload.mutate(file, { onSuccess: onUploaded });
			}}
		/>
	);

	return {
		pick: () => inputRef.current?.click(),
		input,
		uploading: upload.isPending,
	};
}

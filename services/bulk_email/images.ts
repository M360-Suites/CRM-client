import { apiClient } from "@/services/apiclient";
import { UploadedEmailImage } from "@/types/bulk_email";
import { unwrap } from "./normalize";

// Limits enforced by POST /email-images; checked here too so a bad file fails fast
export const EMAIL_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const EMAIL_IMAGE_ACCEPT = EMAIL_IMAGE_TYPES.join(",");
export const EMAIL_IMAGE_MAX_MB = 5;

// Stores the image on Cloudinary and returns its public URL. These images
// aren't listed in Documents and can't be deleted, so sent emails keep them.
export const UploadEmailImage = async (file: File): Promise<string> => {
	if (!EMAIL_IMAGE_TYPES.includes(file.type)) {
		throw new Error("Use a JPG, PNG, GIF or WebP image");
	}
	if (file.size > EMAIL_IMAGE_MAX_MB * 1024 * 1024) {
		throw new Error(`Images must be ${EMAIL_IMAGE_MAX_MB}MB or smaller`);
	}
	const form = new FormData();
	form.append("image", file);
	const data = unwrap(await apiClient.post<UploadedEmailImage>("/email-images", form));
	if (!data?.url) throw new Error("The upload didn't return an image link");
	return data.url;
};

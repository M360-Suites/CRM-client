import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadEmailImage } from "@/services/bulk_email/images";

export const useUploadEmailImage = () =>
	useMutation({
		mutationFn: UploadEmailImage,
		onError: (err: Error) => toast.error(err.message),
	});

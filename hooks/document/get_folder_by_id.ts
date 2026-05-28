import { useQuery } from "@tanstack/react-query";
import { FolderById } from "@/types/document";
import GetFolderById from "@/services/document/get_folder_by_id";

export const useGetFolderById = (folderId: string) => {
  return useQuery<FolderById>({
    queryKey: ["folders", folderId],
    queryFn: () => GetFolderById(folderId),
    refetchInterval: 10 * 60 * 1000,
  });
};

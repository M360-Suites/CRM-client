import { useQuery } from "@tanstack/react-query";
import { Folder } from "@/types/document";
import GetFolders from "@/services/document/get_all_folders";

export const useGetFolders = () => {
  return useQuery<Folder[]>({
    queryKey: ["folders"],
    queryFn: GetFolders,
    refetchInterval: 10 * 60 * 1000,
  });
};

import { create } from "zustand";
import { File, Folder } from "@/types/document";

// Define the type for the document store
interface DocumentStore {
  files?: File[];
  folders?: [];
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
}

// Create the store
export const useDocumentStore = create<DocumentStore>((set) => ({
  files: [],
  folders: [],
  onDownload: (file) => {
    console.log(`Downloading file: ${file.name}`);
    // Add your download logic here
  },
  onDelete: (file) =>
    set((state) => ({ files: state.files?.filter((f) => f.id !== file.id) })),
}));

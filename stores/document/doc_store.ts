import { create } from "zustand";
import { File } from "@/types/document";

// Define the type for the document store
interface DocumentStore {
  files: File[];
  onDownload: (file: File) => void;
  onDelete: (file: File) => void;
}

// Create the store
export const useDocumentStore = create<DocumentStore>((set) => ({
  files: [
    { id: 1, name: "Contacts.csv", size: "1.8MB", date: "May 8, 2026" },
    { id: 2, name: "Leads.csv", size: "2.3MB", date: "May 9, 2026" },
    { id: 3, name: "Opportunities.csv", size: "1.5MB", date: "May 10, 2026" },
  ],
  onDownload: (file) => {
    console.log(`Downloading file: ${file.name}`);
    // Add your download logic here
  },
  onDelete: (file) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== file.id),
    })),
}));

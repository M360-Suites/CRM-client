import { create } from "zustand";
import { File, Folder } from "@/types/document";

// Define the type for the document store
interface DocumentStore {
  files: File[];
  folders: Folder[];
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
  folders: [
    {
      id: 1,
      name: "Q2 Reports",
      description: "Quarterly sales reports for Q2",
      files: [
        {
          id: 4,
          name: "Q2_Sales_Report.pdf",
          size: "3.2MB",
          date: "May 11, 2026",
        },
        {
          id: 5,
          name: "Q2_Marketing_Report.pdf",
          size: "2.8MB",
          date: "May 12, 2026",
        },
      ],
      dateCreated: "May 1, 2026",
      dateUpdated: "May 12, 2026",
      lastUpdatedBy: "Alice Johnson",
    },
    {
      id: 2,
      name: "Client Proposals",
      description: "Proposals for potential clients",
      files: [
        {
          id: 6,
          name: "Proposal_Client_A.pdf",
          size: "1.9MB",
          date: "May 13, 2026",
        },
        {
          id: 7,
          name: "Proposal_Client_B.pdf",
          size: "2.4MB",
          date: "May 14, 2026",
        },
      ],
      dateCreated: "May 2, 2026",
      dateUpdated: "May 14, 2026",
      lastUpdatedBy: "Bob Smith",
    },
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

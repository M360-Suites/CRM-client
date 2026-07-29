export interface File {
  id: number;
  name: string;
  size: string;
  date: string;
}

export interface DocumentOwner {
  _id: string;
  email: string;
  display_name: string;
}

export interface Folder {
  _id: string;
  name: string;
  description: string;
  parent_id: string | null;
  owner_id: DocumentOwner;
  last_modified_by: DocumentOwner;
  organization_id: string;
  created_at: string;
  updated_at: string;
  __v: number;
  document_count: number;
}

export interface Document {
  _id: string;
  original_name: string;
  stored_name: string;
  mime_type: string;
  file_size: number;
  cloudinary_url: string;
  cloudinary_public_id: string;
  folder_id: string;
}

export interface FolderById {
  _id: string;
  name: string;
  description: string;
  parent_id: string | null;
  owner_id: DocumentOwner;
  last_modified_by: DocumentOwner;
  organization_id: string;
  created_at: string;
  updated_at: string;
  __v: number;
  document_count: number;
  documents: Document[];
}

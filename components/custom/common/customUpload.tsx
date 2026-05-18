"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

interface CustomUploadProps {
  label: string;
  placeholder?: string;
  message: string
  onUpload: (file: File) => void;
}

const CustomUpload: React.FC<CustomUploadProps> = ({ onUpload, label, message, placeholder }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="upload">{label}</label>
      <label className="flex flex-col gap-3 items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 bg-[#3333331A]/30 rounded-lg cursor-pointer hover:border-gray-300">
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload color="#6a7282" size={32} />
        <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
        {selectedFile && (
          <span className="mt-2 text-sm text-gray-700">
            Selected: {selectedFile.name}
          </span>
        )}
      </label>
    </div>
  );
};

export default CustomUpload;
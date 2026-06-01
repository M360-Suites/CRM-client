// small skeleton row for the folder list
export function FolderRowSkeleton() {
  return (
    <div className="grid grid-cols-6 px-5 py-6 gap-4 border-b border-[#F3D9C4] bg-white animate-pulse">
      <span className="h-4 bg-gray-200 rounded col-span-1" />
      <span className="h-4 bg-gray-200 rounded col-span-2" />
      <span className="h-4 bg-gray-200 rounded col-span-1" />
      <span className="h-4 bg-gray-200 rounded col-span-1" />
      <span className="h-4 bg-gray-200 rounded col-span-1 text-right" />
    </div>
  );
}

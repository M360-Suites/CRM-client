export function DraftSkeleton() {
  return (
    <div className="flex flex-col gap-4 border border-[#E8E8E8] rounded-[12px] p-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-12 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* to field */}
      <div className="border-y py-3 flex items-center gap-2">
        <div className="h-4 w-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-9 w-48 bg-gray-100 rounded-full animate-pulse" />
      </div>

      {/* subject field */}
      <div className="border-b pb-3 flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded-full animate-pulse" />
      </div>

      {/* body lines */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="h-3.5 w-full bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3.5 w-full bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3.5 w-3/4 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3.5 w-full bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3.5 w-5/6 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3.5 w-full bg-gray-100 rounded-full animate-pulse" />
        <div className="h-3.5 w-2/5 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <div className="w-full pt-8 flex flex-col gap-10">
      <div className="flex flex-col gap-1 w-full">
        <h2 className="xl:text-2xl lg:text-xl/[110%] text-lg font-medium text-[#3A2418]">
          AI Email Writer
        </h2>
        <span className="xl:text-base text-sm font-medium text-foreground">
          Context-aware drafts powered by AI. Edit before sending.
        </span>
      </div>
    </div>
  );
}

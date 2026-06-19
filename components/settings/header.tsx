export default function Header() {
  return (
    <div className="w-full pt-8">
      <div className="flex flex-col gap-1 w-full">
        <h2 className="xl:text-2xl text-xl/[110%] font-medium text-[#3A2418]">
          Settings
        </h2>
        <span className="xl:text-base text-sm font-medium text-foreground">
          Manage your account, preferences, and application settings
        </span>
      </div>
    </div>
  );
}

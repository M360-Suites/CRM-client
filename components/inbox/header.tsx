export default function Header() {
  return (
    <div className="w-full pt-8 flex flex-col gap-10">
      <div className="flex flex-col gap-1 w-full">
        <h2 className="text-2xl font-medium text-[#3A2418]">Unified Inbox</h2>
        <span className="text-base font-medium text-foreground">
          Inbound messages from email, whatsApp and socials in one place.
          Connect channels in settings to auto-route messages here.
        </span>
      </div>
    </div>
  );
}

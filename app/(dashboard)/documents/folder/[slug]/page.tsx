import Body from "@/components/document/folder/body";
import Header from "@/components/document/folder/header";

export default async function FolderSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // console.log("route slug:", slug);

  return (
    <div className="w-full flex flex-col gap-8 pb-8">
      <Header id={slug} />
      <Body id={slug} />
    </div>
  );
}

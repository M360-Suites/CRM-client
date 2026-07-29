import Body from "@/components/document/folder/body";
import Header from "@/components/document/folder/header";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Folder - ${slug} | CRM360`,
  };
}

export default async function FolderSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="w-full flex flex-col gap-8 pb-8">
      <Header id={slug} />
      <Body id={slug} />
    </div>
  );
}

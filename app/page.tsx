import { redirect } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function Home() {
  redirect("/login");
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Image
        src={Logo}
        height={100}
        width={100}
        alt="logo"
        className="animate-pulse h-20 w-20"
      />
    </div>
  );
}

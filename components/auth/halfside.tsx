"use client";
import { usePathname } from "next/navigation";

interface DataProp {
  type: string;
  title: string;
  description: string;
}

const halfSideData: DataProp[] = [
  {
    type: "login",
    title: "Your relationships Streamlined. Your growth Accelerated.",
    description:
      "CRM360 helps you manage leads, close deals, and build lasting customer relationships - all in one place.",
  },
  {
    type: "register",
    title: "Grow relationships. Close more deals.All in one place.",
    description:
      "CRM360 helps you manage leads, close deals, and build lasting customer relationships - all in one place.",
  },
];

export default function HalfSide() {
  const pathname = usePathname();
  const value = Object(
    halfSideData.find((data) => pathname.includes(data.type)),
  );

  console.log("value:", value);
  return (
    <div className="w-full bg-[#FFF6EC] h-full flex justify-center pb-6 rounded-[16px]">
      <div className="flex flex-col gap-4 items-center justify-end h-full w-144.5">
        <h1 className="text-[38px]/[120%] text-foreground tracking-tight font-medium text-center">
          {value.title}
        </h1>
        <p className="text-base text-center font-normal text-foreground">
          {value.description}
        </p>
      </div>
    </div>
  );
}

"use client";
import { usePathname } from "next/navigation";
import Analytics from "@/public/assets/auth/analytics.png";
import ForgotImg from "@/public/assets/auth/forgot-password.png";
import OtpImg from "@/public/assets/auth/otp.png";
import ResetImg from "@/public/assets/auth/reset-password.png";
import { StaticImageData } from "next/image";
import Image from "next/image";

interface DataProp {
  type: string;
  title?: string;
  description?: string;
  url: StaticImageData;
}

const halfSideData: DataProp[] = [
  {
    type: "login",
    title: "Your relationships Streamlined. Your growth Accelerated.",
    description:
      "CRM360 helps you manage leads, close deals, and build lasting customer relationships - all in one place.",
    url: Analytics,
  },
  {
    type: "register",
    title: "Grow relationships. Close more deals.All in one place.",
    description:
      "CRM360 helps you manage leads, close deals, and build lasting customer relationships - all in one place.",
    url: Analytics,
  },
  {
    type: "forgot-password",
    url: ForgotImg,
  },
  {
    type: "verification",
    url: OtpImg,
  },
  {
    type: "otp-verification",
    url: OtpImg,
  },
  {
    type: "reset-password",
    url: ResetImg,
  },
];

export default function HalfSide() {
  const pathname = usePathname();
  const value = Object(
    halfSideData.find((data) => pathname.includes(data.type)),
  );

  const otherHalf = [
    "verification",
    "forgot-password",
    "reset-password",
    "otp-verification",
  ];

  return (
    <div className="w-full bg-[#FFF6EC] min-h-screen xl:min-h-screen flex flex-col py-12 xl:py-20 items-center justify-center px-5 xl:px-10 rounded-[16px] gap-8">
      <div
        className={`flex items-center justify-center ${otherHalf.includes(value.type) && "bg-white"} rounded-[16px]`}
      >
        <Image
          src={value.url}
          alt="analytics"
          width={800}
          height={800}
          className="w-full h-full block object-cover"
        />
      </div>
      {(value.type === "login" || value.type === "register") && (
        <div className="flex flex-col gap-4 items-center justify-end">
          <h1 className="text-[38px]/[120%] text-foreground tracking-tight font-medium text-center">
            {value.title}
          </h1>
          <p className="text-base text-center font-normal text-foreground">
            {value.description}
          </p>
        </div>
      )}
    </div>
  );
}

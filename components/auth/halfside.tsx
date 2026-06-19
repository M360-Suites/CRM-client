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
    <div
      className={`lg:w-1/2 max-lg:hidden h-full bg-[#FFF6EC] flex flex-col justify-center xl:py-8 py-3 px-5 xl:px-12 rounded-[16px] gap-15 lg:gap-10 ${(value.type !== "login" || value.type === "register") && "min-h-[95svh] "}`}
    >
      <div
        className={`flex items-center justify-center w-full min-h-full ${otherHalf.includes(value.type) && "bg-white"} rounded-[16px]`}
      >
        <Image
          src={value.url}
          alt="analytics"
          width={800}
          height={800}
          className="max-h-full xl:w-[85%] w-auto object-cover"
        />
      </div>
      {(value.type === "login" || value.type === "register") && (
        <div className="flex flex-col gap-4 items-center justify-center w-full">
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

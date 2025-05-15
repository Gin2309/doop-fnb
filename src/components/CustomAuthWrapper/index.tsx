import Image from "next/image";
import LogoAuth from "@/assets/logo_auth.svg";
import BannerAuth from "@/assets/images/aubanner1.png";
import React from "react";
import Link from "next/link";

interface CustomAuthWrapperProps {
  children: React.ReactNode;
  title: string;
}

export function CustomAuthWrapper({ children, title }: CustomAuthWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-auth w-full">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="xl:w-[1082px] 2xs:w-[100%] lg:w-[80%] sm:w-[80%] overflow-hidden min-h-[592px] bg-white flex rounded-[32px]">
          <div className="w-[50%] 2xs:hidden xl:block relative overflow-hidden bg-slate-300">
            <Image
              src={BannerAuth}
              alt="Banner"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
            />
          </div>

          <div className="xl:w-[50%] 2xs:w-full  relative text-center xl:px-[40px] 2xs:px-[30px] flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="pt-[50px]">
              <Link href="/auth/sign-in">
                <Image src={LogoAuth} alt="Logo" className="cursor-pointer" />
              </Link>
              <h1 className="text-[34px] font-semibold leading-[47px] py-[5px] mb-[20px] mt-[6px]">
                {title}
              </h1>
            </div>
            <div className="flex-1">{children}</div>
            <div className="mb-3 py-[10px]">
              <p className="italic">
                Nếu cần hỗ trợ?
                <span className="px-1 underline hover:no-underline font-medium">
                  <Link href="/auth/sign-in">Nhấn vào đây</Link>
                </span>
                hoặc liên hệ hotline <strong>091.858.1819</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full">
        <p className="text-center w-full py-3">
          Copyright © 2024 Doop.vn, phiên bản V2412
        </p>
      </footer>
    </div>
  );
}

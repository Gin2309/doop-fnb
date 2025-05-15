import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const Card = ({
  router,
  img,
  title,
}: {
  router: string;
  img: any;
  title: string;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Link href={`settings/${router}`}>
        <div className="border-[#E5E5E5] cursor-pointer border-[2px] rounded-2xl justify-center items-center p-4 flex flex-col">
          <div>
            <Image src={img} />
          </div>
          <div>
            <p className="text-[#333333] text-[14px] font-medium mt-2">
              {t(title)}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Card;

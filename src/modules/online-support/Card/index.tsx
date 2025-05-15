import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";

import Checked from "@/assets/Checked.svg";
import Clock from "@/assets/clock4.svg";

const Card = ({
  branch,
  problem,
  status,
  id,
}: {
  branch: string;
  problem: string;
  status: "done" | "waiting" | string;
  id: any;
}) => {
  const { t } = useTranslation();

  const isDone = status === "done";

  return (
    <div className="shadow-lg rounded-lg bg-[#fff]">
      <div className="border-b-[1px] border-[#ccc] flex justify-between items-center h-[52px]">
        <div
          className={`${
            isDone ? "bg-[#05A660]" : "bg-[#FF8800]"
          } px-3 py-2 rounded-tr-2xl rounded-br-2xl flex items-center gap-2`}
        >
          <Image src={isDone ? Checked : Clock} height={14} width={14} />
          <div className="text-[#FFFFFF] font-semibold">
            {t(isDone ? "answered" : "waiting")}
          </div>
        </div>
        {isDone && (
          <div>
            <Link href={`/online-support/${id}`}>
              <span className="text-[#FF5C00] font-semibold mr-3">
                {t("viewFeedback")}
              </span>
            </Link>
          </div>
        )}
      </div>
      <div className="gap-2 p-4 flex flex-col">
        <div className="flex gap-2">
          <div className="bg-[#E5E5E5] rounded-lg px-2 py-1 text-[#333333] font-semibold">
            {branch}
          </div>
          <div className="bg-[#D6DDFF] text-[#3355FF] rounded-lg px-2 py-1 font-semibold">
            {problem}
          </div>
        </div>
        <div>
          <span className="text-[#666666] text-[14px]">01/02/2020 15:06</span>
        </div>
        <h1 className="text-[#1C1C28] font-semibold">
          Yêu cầu hỗ trợ mục thống kê thu chi
        </h1>
        <p className="text-[#666666] text-justify">
          Lorem ipsum dolor sit amet consectetur. Neque quis eu quam quisque
          maecenas vel. Mauris netus mauris dictum volutpat purus in. Dolor vel
          est dui aliquam.
        </p>
      </div>
    </div>
  );
};

export default Card;

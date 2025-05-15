import React, { useState } from "react";
import Image from "next/image";
import { message, Popover } from "antd";

import { StyledComponent, StyledPopoverContent } from "./styled";
import ThreeDot from "@/assets/DotsThree.svg";
import Clock from "@/assets/Clock.svg";
import Share from "@/assets/Share.svg";
import User from "@/assets/User.svg";
import { deletePosition } from "@/api/config-position.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import Dish3 from "@/assets/Dish3.svg";
import Money from "@/assets/Money.svg";
import PencilSimple from "@/assets/PencilSimplePos.svg";
import Cursor from "@/assets/Cursor.svg";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import SunDimIcon from "@/assets/SunDim.svg";
import DollarIcon from "@/assets/Dollar-coin.svg";
import RobotIcon from "@/assets/robot.svg";
import {
  calculateMinutesFromCreateAt,
  calculateReceptionTime,
  formatTime,
  formatTimeCreateAt,
} from "@/utils";
import { ro } from "@faker-js/faker";

interface CardProps {
  seenOption?: string;
  data: any;
  onClick?: any;
}

const Card: React.FC<CardProps> = ({ data, seenOption, onClick }) => {
  const [open, setOpen] = useState(false);
  const branch = useRecoilValue(branchStateSession);
  const [positionSelect, setPositionSelect] = useState<any>(null);

  return (
    <div
      className={`${seenOption === "EXTEND" ? "w-full" : ""}  cursor-pointer`}
      onClick={onClick}
    >
      {seenOption === "EXTEND" ? (
        <StyledComponent>
          <div
            className={`${data.type} ${
              data.positionStatus === "BLANK"
                ? "bg-white border-[#E5E5E5]"
                : data.positionStatus === "BOOKED"
                ? "bg-[#7F35DE]"
                : data.positionStatus === "USED"
                ? "bg-[#D9F6EA] border-[#148C4B]"
                : "bg-[#7D808F]"
            } shadow-xl h-full rounded-lg border-[1px] p-5 gap-2 flex flex-col min-w-[200px] xl:min-w-[263px]`}
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                <span
                  className={`
            ${data.type}-btn h-9 min-w-[85px] p-1.5
            rounded-[8px] text-white font-semibold flex items-center justify-center
            ${
              data.positionStatus === "BLANK"
                ? "bg-[#7D808F]"
                : data.positionStatus === "BOOKED"
                ? "bg-[#007BFF]"
                : data.positionStatus === "USED"
                ? "bg-[#148C4B]"
                : "bg-[#7D808F]"
            }
          `}
                >
                  {data?.name}
                </span>
                <div className="ml-2 flex gap-1">
                  {data?.lightActive === true && (
                    <button aria-label="More options">
                      <Image src={SunDimIcon} alt="More" />
                    </button>
                  )}

                  {data?.robotActive === true && (
                    <button aria-label="More options">
                      <Image src={RobotIcon} alt="More" />
                    </button>
                  )}

                  {data?.paidActive === true && (
                    <button aria-label="More options">
                      <Image src={DollarIcon} alt="More" />
                    </button>
                  )}
                </div>
                {data.number ? (
                  <span className="bg-[#E50000] rounded-full ml-2 w-[32px] h-[32px] flex justify-center items-center text-[#fff]">
                    {data.number}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex">
              <Image src={Clock} />
              <span className={`${data.type}-span-1 ml-2`}>
                {data?.positionStatus === "BLANK" ? (
                  "Bàn trống"
                ) : data?.positionStatus === "BOOKED" ? (
                  <span className="">
                    ({calculateReceptionTime(data?.receptionTime)})
                    {" nữa nhận bàn"}
                  </span>
                ) : data?.positionStatus === "USED" ? (
                  <p>
                    {formatTimeCreateAt(data?.updatedAt)}{" "}
                    <span className="text-[#148C4B]">
                      (SD:
                      {calculateMinutesFromCreateAt(data?.receptionTime)}
                      p){" "}
                    </span>
                  </p>
                ) : (
                  "Không xác định"
                )}
              </span>
            </div>
            <div className="flex">
              <Image src={User} />
              <span
                className={`${data.type}-span-2 ml-2  ${
                  data.positionStatus === "BLANK"
                    ? ""
                    : data.positionStatus === "BOOKED"
                    ? "text-[#007BFF]"
                    : data.positionStatus === "USED"
                    ? "text-[#148C4B]"
                    : "text-black"
                }`}
              >
                {data?.customerName && data?.customerName.trim() !== ""
                  ? data.customerName
                  : "Khách lẻ"}
              </span>
            </div>
          </div>
        </StyledComponent>
      ) : (
        <div>
          <button
            className={`border-[1px] min-w-[100px] px-3 h-[50px] rounded-md font-semibold ${
              data.positionStatus === "BLANK"
                ? "bg-white border-[#E5E5E5]"
                : data.positionStatus === "BOOKED"
                ? "bg-[#7F35DE]"
                : data.positionStatus === "USED"
                ? "bg-[#D9F6EA] border-[#148C4B]"
                : "bg-[#7D808F]"
            }`}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            {data?.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;

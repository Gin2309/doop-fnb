import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { Popover } from "antd";
import { StyledComponent, StyledPopoverContent } from "./styled";
import {
  calculateMinutesFromCreateAt,
  calculateReceptionTime,
  formatTimeCreateAt,
} from "@/utils";
import ModalOpenTable from "../ModalOpenTable";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

import ThreeDot from "@/assets/DotsThree.svg";
import Clock from "@/assets/Clock.svg";
import Share from "@/assets/Share.svg";
import User from "@/assets/User.svg";
import Dish3 from "@/assets/Dish3.svg";
import Money from "@/assets/Money.svg";
import PencilSimple from "@/assets/PencilSimplePos.svg";
import Cursor from "@/assets/BlackCursor.svg";
import SunDimIcon from "@/assets/SunDim.svg";
import DollarIcon from "@/assets/Dollar-coin.svg";
import RobotIcon from "@/assets/robot.svg";

interface CardProps {
  seenOption?: string;
  data: any;
  setOpenListPosition: any;
  onClick?: any;
}

const Card: React.FC<CardProps> = ({
  data,
  seenOption,
  setOpenListPosition,
  onClick,
}) => {
  const [open, setOpen] = useState(false);
  const branch = useRecoilValue(branchStateSession);
  const [contextOpen, setContextOpen] = useState(false);
  const router = useRouter();
  const [openSetTable, SetOpenSetTable] = useState(false);

  const [positionSelect, setPositionSelect] = useState<any>(null);

  const contentBlank = (
    <StyledPopoverContent>
      <div className="bg-[#fff] p-3 rounded-[6px] border-[1px] border-[#D7DFE9] min-w-[200px]">
        <div
          className="p-2 border-b flex items-center gap-2 cursor-pointer"
          onClick={() => {
            SetOpenSetTable(true);
            setOpen(false);
          }}
        >
          <Image
            src={Share}
            width={20}
            height={20}
            className="translate-y-[-1px]"
          />
          <p>Mở bàn</p>
        </div>
        <div
          className="p-2 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            router.push("/pos/table/form/add");
          }}
        >
          <Image src={Clock} className="translate-y-[-1px]" />
          <p>Đặt bàn</p>
        </div>
      </div>
    </StyledPopoverContent>
  );

  const contentUse = (
    <StyledPopoverContent>
      <div className="bg-[#fff] p-3 rounded-[6px] border-[1px] border-[#D7DFE9] min-w-[200px]">
        <div
          className="p-2 border-b flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setOpenListPosition(true);
            setOpen(false);
          }}
        >
          <Image
            src={Cursor}
            width={20}
            height={20}
            className="translate-y-[-1px]"
          />
          <p>Đổi bàn</p>
        </div>

        <div
          className="p-2 border-b flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (positionSelect?.id) {
              router.push({
                pathname: `/pos/diagram/${positionSelect.id}`,
                query: { edit: true },
              });
              setOpen(false);
            }
          }}
        >
          <Image src={PencilSimple} alt="Edit Icon" />
          <p className="text-sm">Chỉnh sửa</p>
        </div>

        <div
          className="p-2 border-b flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (positionSelect?.id) router.push(`/pos/diagram/${positionSelect.id}`);
            setOpen(false);
          }}
        >
          <Image src={Dish3} className="translate-y-[-1px]" />
          <p>Chọn món</p>
        </div>

        <div
          className="p-2 flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (positionSelect?.id) {
              router.push({
                pathname: `/pos/diagram/${positionSelect.id}`,
                query: { payment: true },
              });
              setOpen(false);
            }
          }}
        >
          <Image src={Money} className="translate-y-[-1px]" />
          <p>Thanh toán</p>
        </div>
      </div>
    </StyledPopoverContent>
  );

  return (
    <div
      className={`${
        seenOption === "EXTEND" ? "w-full h-full" : ""
      }  cursor-pointer`}
      onClick={onClick}
    >
      {seenOption === "EXTEND" ? (
        <StyledComponent>
          <div
            onClick={() => {
              if (data.positionStatus === "USED") {
                router.push(`/pos/diagram/${data?.id}`);
              } else if (data.positionStatus === "BLANK") {
                SetOpenSetTable(true);
                setPositionSelect(data);
              }
            }}
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
              <div>
                <Popover
                  content={
                    data.positionStatus === "BLANK"
                      ? contentBlank
                      : data.positionStatus === "BOOKED"
                      ? contentBlank
                      : data.positionStatus === "USED"
                      ? contentUse
                      : contentBlank
                  }
                  title={null}
                  trigger="click"
                  open={open}
                  onOpenChange={() => setOpen(false)}
                  placement="bottomRight"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(true);
                      setPositionSelect(data?.positionDetail);
                    }}
                    className="cursor-pointer"
                  >
                    <Image src={ThreeDot} alt="Options menu" />
                  </div>
                </Popover>
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
        <div
          onClick={(e) => {
            if (data.positionStatus === "USED") {
              e.stopPropagation();
              router.push(`/pos/diagram/${data?.id}`);
            }
          }}
        >
          <Popover
            content={
              data.positionStatus === "BLANK"
                ? contentBlank
                : data.positionStatus === "BOOKED"
                ? contentBlank
                : data.positionStatus === "USED"
                ? contentUse
                : contentBlank
            }
            title={null}
            trigger="click"
            open={contextOpen}
            onOpenChange={(visible) => setContextOpen(visible)}
            placement="bottomRight"
          >
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
                setContextOpen(true);
              }}
            >
              {data?.name}
            </button>
          </Popover>
        </div>
      )}

      {openSetTable && (
        <ModalOpenTable
          positionSelect={positionSelect}
          openModal={openSetTable}
          setOpenModal={SetOpenSetTable}
          tableId={data?.id}
          branchId={branch?.id}
        />
      )}
    </div>
  );
};

export default Card;

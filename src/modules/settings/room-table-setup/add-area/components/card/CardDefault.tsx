import React, { useState } from "react";
import Image from "next/image";
import { StyledComponent } from "./styled";
import Clock from "@/assets/Clock.svg";
import User from "@/assets/User.svg";
import SunDimIcon from "@/assets/SunDim.svg";
import DollarIcon from "@/assets/Dollar-coin.svg";
import RobotIcon from "@/assets/robot.svg";
interface CardProps {
  seenOption?: string;
  data: {
    id?: number | null;
    type: string | "empty" | "occupied" | "reserved";
    number?: number | null;
    name?: string | null;
    table?: string | null;
    phone?: string | null;
    time?: string | null;
    areaId?: string | null;
    lightActive: boolean | null;
    robotActive: boolean | null;
    paidActive: boolean | null;
  };
}

const CardDefault: React.FC<CardProps> = ({ data, seenOption }) => {
  return (
    <div className="w-[100%]">
      <div className={`${seenOption === "EXTEND" ? "w-full mb-4" : ""}`}>
        <p className=" italic py-2">Phòng trống:</p>
        {seenOption === "EXTEND" ? (
          <StyledComponent>
            <div className="rounded-lg p-4 gap-4 flex flex-col min-w-[200px] xl:min-w-[263px] border-[1px] border-[#eee]">
              <div className="flex justify-between gap-[20px]">
                <div className="flex items-center">
                  <span className=" py-2 min-w-[80px] max-w-[120px] overflow-hidden  bg-[#7D808F] whitespace-nowrap px-5  rounded-[8px] text-white font-semibold flex justify-center items-center text-center">
                    {data?.name || "B-01"}
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
                </div>
              </div>
              <div className="flex">
                <Image src={Clock} />
                <span className="ml-2">Bàn trống</span>
              </div>
              <div className="flex">
                <Image src={User} />
                <span className="ml-2">Khách lẻ</span>
              </div>
            </div>
          </StyledComponent>
        ) : (
          <div>
            <button className="border-[1px] min-w-[100px] px-3 h-[50px] rounded-md font-semibold mb-3">
              <p className="w-[100px] text-line-1">{data?.name}</p>
            </button>
          </div>
        )}
      </div>

      <div className={`${seenOption === "EXTEND" ? "w-full mb-4" : ""}`}>
        <p className="italic py-2">Đặt trước:</p>
        {seenOption === "EXTEND" ? (
          <StyledComponent>
            <div className="border-[1px] border-[#eee] rounded-lg p-4 gap-4 flex flex-col min-w-[200px] xl:min-w-[263px]">
              <div className="flex justify-between gap-[20px]">
                <div className="flex items-center">
                  <span className=" py-2 min-w-[80px] max-w-[120px] overflow-hidden  bg-[#7F35DE] whitespace-nowrap px-5  rounded-[8px] text-white font-semibold flex justify-center items-center text-center">
                    {data?.name || "B-01"}
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
                </div>
              </div>
              <div className="flex">
                <Image src={Clock} />
                <span className="ml-2">3h 6 phút nữa nhận bàn</span>
              </div>
              <div className="flex">
                <Image src={User} />
                <span className="ml-2">
                  <strong className="text-[#7F35DE]">Tên khách</strong> - Số
                  điện thoại
                </span>
              </div>
            </div>
          </StyledComponent>
        ) : (
          <div>
            <button className="border-[1px] min-w-[100px] px-3 h-[50px] rounded-md  mb-3 text-[#fff] bg-[#7F35DE]">
              <p className="w-[100px] text-line-1">{data?.name}</p>
              <p className="text-[12px]">1h 18p</p>
            </button>
          </div>
        )}
      </div>

      <div className={`${seenOption === "EXTEND" ? "w-full mb-4 " : ""}`}>
        <p className="italic py-2">Đang sử dụng:</p>
        {seenOption === "EXTEND" ? (
          <StyledComponent>
            <div className="border-[1px] border-[#8bc084] bg-[#D9F6EA] rounded-lg p-4 gap-4 flex flex-col min-w-[200px] xl:min-w-[263px]">
              <div className="flex justify-between gap-[20px]">
                <div className="flex items-center">
                  <span className=" py-2 min-w-[80px] max-w-[120px] overflow-hidden  bg-[#148C4B] whitespace-nowrap px-5  rounded-[8px] text-white font-semibold flex justify-center items-center text-center">
                    {data?.name || "B-01"}
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
                </div>
              </div>
              <div className="flex">
                <Image src={Clock} />
                <span className="ml-2">26/8 10:38 (SD:120p)</span>
              </div>
              <div className="flex">
                <Image src={User} />
                <span className="ml-2">Khách lẻ</span>
              </div>
            </div>
          </StyledComponent>
        ) : (
          <div>
            <button className="border-[1px] min-w-[100px] px-3 h-[50px] rounded-md text-[#fff] mb-3 bg-[#148C4B] ">
              <p className="w-[100px] text-line-1">{data?.name || "B-01"}</p>
              <p className="text-[12px]">1h 18p</p>
            </button>
          </div>
        )}
      </div>

      <div className={`${seenOption === "EXTEND" ? "w-full mb-4" : ""}`}>
        <p className="italic py-2">Đang sử dụng - thẻ tháng:</p>
        {seenOption === "EXTEND" ? (
          <StyledComponent>
            <div className="border-[1px] border-[#8bc084] bg-[#D9F6EA]  rounded-lg p-4 gap-4 flex flex-col min-w-[200px] xl:min-w-[263px]">
              <div className="flex justify-between gap-[20px]">
                <div className="flex items-center">
                  <span className=" py-2 min-w-[80px] max-w-[120px] overflow-hidden  bg-[#3942E0] whitespace-nowrap px-5  rounded-[8px] text-white font-semibold flex justify-center items-center text-center">
                    {data?.name || "B-01"}
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
                </div>
              </div>
              <div className="flex">
                <Image src={Clock} />
                <span className="ml-2">26/8 10:38 (SD:120p)</span>
              </div>
              <div className="flex">
                <Image src={User} />
                <span className="ml-2">Khách lẻ</span>
              </div>
            </div>
          </StyledComponent>
        ) : (
          <div>
            <button className="border-[1px] min-w-[100px] px-3 h-[50px] rounded-md mb-3 text-[#fff] py-1 bg-[#3942E0]">
              <p className="w-[100px] text-line-1 text-[#fff]">
                {data?.name || "B-01"}
              </p>
              <p className="text-[12px]">1h 18p</p>
            </button>
          </div>
        )}
      </div>

      <div className={`${seenOption === "EXTEND" ? "w-full mb-4" : ""}`}>
        <p className="italic py-2">Đang sử dụng - yêu cầu thanh toán:</p>
        {seenOption === "EXTEND" ? (
          <StyledComponent>
            <div className="border-[1px] border-[#8bc084] bg-[#D9F6EA]  rounded-lg p-4 gap-4 flex flex-col min-w-[200px] xl:min-w-[263px]">
              <div className="flex justify-between gap-[20px]">
                <div className="flex items-center">
                  <span className=" py-2 min-w-[80px] max-w-[120px] overflow-hidden  bg-[#E50000] whitespace-nowrap px-5  rounded-[8px] text-white font-semibold flex justify-center items-center text-center">
                    {data?.name || "B-01"}
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
                </div>
              </div>
              <div className="flex">
                <Image src={Clock} />
                <span className="ml-2">26/8 10:38 (SD:120p)</span>
              </div>
              <div className="flex">
                <Image src={User} />
                <span className="ml-2">Khách lẻ</span>
              </div>
            </div>
          </StyledComponent>
        ) : (
          <div>
            <button className="border-[1px] min-w-[100px] px-3 h-[50px] rounded-md bg-[#E50000] text-[#fff]">
              <p className="w-[100px] text-line-1 font-semibold">
                {data?.name || "B-01"}
              </p>
              <p className="text-[12px]">1h 18p</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDefault;

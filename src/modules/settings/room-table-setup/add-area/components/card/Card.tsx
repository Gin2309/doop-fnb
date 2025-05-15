import React, { useState } from "react";
import Image from "next/image";
import { message, Popover } from "antd";

import { StyledComponent, StyledPopoverContent } from "./styled";
import { deletePosition } from "@/api/config-position.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";

import ThreeDot from "@/assets/DotsThree.svg";
import Clock from "@/assets/Clock.svg";
import User from "@/assets/User.svg";
import DeleteIcon from "@/assets/deleteRed.svg";
import CloseIcon from "@/assets/close.svg";
import EditIcon from "@/assets/editBlue.svg";
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

const Card: React.FC<CardProps> = ({ data, seenOption }) => {
  const [open, setOpen] = useState(false);
  const branch = useRecoilValue(branchStateSession);
  const [contextOpen, setContextOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const { mutate: deletePositionMutation, isLoading: isDeleting } = useMutation(
    () => {
      return deletePosition(Number(data?.id), Number(branch.id));
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["AREA"]);
        await queryClient.invalidateQueries(["POS"]);
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
        message.success("Xóa bàn thành công!");
        router.back();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const handleDelete = () => {
    deletePositionMutation();
  };

  const content = (
    <StyledPopoverContent>
      <div className="bg-[#fff] p-5 rounded-[6px] border-[1px] border-[#D7DFE9] min-w-[400px]">
        <div className="header">
          <div className=" flex gap-4 justify-between w-full">
            <div className="flex-1">
              <h1 className="text-[#666666] font-semibold text-[18px] text-line-1 w-[200px]">
                {data.name}
              </h1>
            </div>
            <div className="flex gap-[10px]">
              <Image
                src={EditIcon}
                alt="Edit"
                height={24}
                width={24}
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/settings/room-table-setup/add-area/add-table?id=${data.id}&areaId=${data.areaId}`
                  )
                }
              />
              <Image
                src={DeleteIcon}
                alt="Delete"
                height={24}
                width={24}
                className="cursor-pointer"
                onClick={() => {
                  setShowDeleteNoti({
                    visible: true,
                    content: `Xóa ${data?.name}`,
                  });
                  setOpen(false);
                  setContextOpen(false);
                }}
              />
              <Image
                src={CloseIcon}
                alt="Close"
                onClick={() => setOpen(false)}
                height={24}
                width={24}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="content flex gap-4 flex-col">
          <h1 className="text-[#666666] font-semibold mt-4 text-[18px]">
            {data?.type}
          </h1>
        </div>
      </div>
    </StyledPopoverContent>
  );

  return (
    <div className={`${seenOption === "EXTEND" ? "w-full" : ""}`}>
      {seenOption === "EXTEND" ? (
        <StyledComponent>
          <div
            className={`${data.type} shadow-xl rounded-lg p-4 gap-4 flex flex-col min-w-[200px] xl:min-w-[263px]`}
          >
            <div className="flex justify-between gap-[20px]">
              <div className="flex items-center">
                <span
                  className={`${data.type}-btn py-2 min-w-[80px] max-w-[120px] overflow-hidden  bg-[#7D808F] whitespace-nowrap px-5  rounded-[8px] text-white font-semibold flex justify-center items-center text-center`}
                >
                  {data.name}
                </span>
                {data.number ? (
                  <span className="bg-[#E50000] rounded-full ml-2 w-[32px] h-[32px] flex justify-center items-center text-[#fff]">
                    {data.number}
                  </span>
                ) : null}

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
              <div>
                <Popover
                  content={content}
                  title={null}
                  trigger="click"
                  open={open}
                  onOpenChange={() => setOpen(false)}
                  placement="bottomRight"
                >
                  <div onClick={() => setOpen(true)} className="cursor-pointer">
                    <Image src={ThreeDot} alt="More" />
                  </div>
                </Popover>
              </div>
            </div>
            <div className="flex">
              <Image src={Clock} />
              <span className={`${data.type}-span-1 ml-2`}>Bàn trống</span>
            </div>
            <div className="flex">
              <Image src={User} />
              <span className={`${data.type}-span-2 ml-2`}>Khách lẻ</span>
            </div>
          </div>
        </StyledComponent>
      ) : (
        <div>
          <Popover
            content={content}
            title={null}
            trigger="click"
            open={contextOpen}
            onOpenChange={(visible) => setContextOpen(visible)}
            placement="bottomRight"
          >
            <button
              className="border-[1px] min-w-[100px] px-3 h-[50px] rounded-md font-semibold"
              onContextMenu={(e) => {
                e.preventDefault();
                setContextOpen(true);
              }}
            >
              <p className="w-[100px] text-line-1">{data?.name}</p>
            </button>
          </Popover>
        </div>
      )}

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti?.visible}
          setIsVisible={setShowDeleteNoti}
          title="Bạn có chắc chắn muốn xóa?"
          content={showDeleteNoti.content}
          type="warn"
          onSubmit={handleDelete}
        />
      )}
    </div>
  );
};

export default Card;

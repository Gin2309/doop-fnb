import { CustomButton } from "@/components/CustomButton";
import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomModal } from "@/components/CustomModal";
import { DishPosIcon } from "@/shared/icons/DishPosIcon";
import { DotThreeIcon } from "@/shared/icons/DotThreeIcon";
import Image from "next/image";
import MapTrifold from "@/assets/MapTrifoldPos.svg";
import ForkKnifePos from "@/assets/ForkKnifePos.svg";
import { CustomBoxShadow } from "@/components/CustomBoxShadow";

const DetailDish = ({
  isOpen,
  onCancel,
  tableData,
}: {
  isOpen: boolean;
  onCancel: () => void;
  tableData: any;
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={`Bàn số ${tableData?.id}`}
      width={1000}
      footer={false}
    >
      <div className="flex flex-col gap-4 overflow-auto h-[80vh]">
        <CustomBoxShadow>
          <div className="flex justify-between border-b">
            <div
              className={`p-4  rounded-br-3xl rounded-tl-3xl`}
              style={{
                backgroundColor: "#009933",
              }}
            >
              <DishPosIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex gap-5 items-center ">
              <div className="flex gap-2 items-center">
                <Image src={MapTrifold} width={28} height={28} />
                <p className="text-lg">30 phút</p>
              </div>

              <div className="flex gap-2 items-center">
                <Image src={ForkKnifePos} width={28} height={28} />
                <p className="text-lg">3 món</p>
              </div>
              <CustomButton
                className={`p-2 px-5 !rounded-lg text-white !bg-[#1B4DFF]`}
              >
                Thanh toán
              </CustomButton>
              <DotThreeIcon className="mx-5" />
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex justify-between p-3 border-b border-dashed">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#009933] rounded-full" />
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">
                    <span className="text-[#E92215] text-lg font-semibold">
                      1 x{" "}
                    </span>
                    Mỳ cay sường sụn
                  </p>
                  <p className="text-sm text-[#0094FF]">Cấp độ 2</p>
                  <p className="text-sm text-[#666666]">
                    8986 - 28/08/2024 12:22 - Bởi Ngân
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Bàn 2</p>
                <p className="text-sm text-[#666666]">Vừa xong</p>
              </div>
              <div className="flex gap-5">
                <CustomButton type="primary" className=" font-semibold">
                  Chờ chế biến
                </CustomButton>
              </div>
            </div>
            <div className="flex justify-between p-3 border-b border-dashed">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#009933] rounded-full" />
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">
                    <span className="text-[#E92215] text-lg font-semibold">
                      1 x{" "}
                    </span>
                    Mỳ cay sường sụn
                  </p>
                  <p className="text-sm text-[#0094FF]">Cấp độ 2</p>
                  <p className="text-sm text-[#666666]">
                    8986 - 28/08/2024 12:22 - Bởi Ngân
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Bàn 2</p>
                <p className="text-sm text-[#666666]">Vừa xong</p>
              </div>
              <div className="flex gap-5">
                <CustomButton type="primary" className=" font-semibold">
                  Chờ chế biến
                </CustomButton>
              </div>
            </div>
          </div>
        </CustomBoxShadow>

        <CustomBoxShadow>
          <div className="flex justify-between border-b">
            <div
              className={`p-4  rounded-br-3xl rounded-tl-3xl`}
              style={{
                backgroundColor: "#009933",
              }}
            >
              <DishPosIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex gap-5 items-center ">
              <div className="flex gap-2 items-center">
                <Image src={MapTrifold} width={28} height={28} />
                <p className="text-lg">30 phút</p>
              </div>

              <div className="flex gap-2 items-center">
                <Image src={ForkKnifePos} width={28} height={28} />
                <p className="text-lg">3 món</p>
              </div>
              <CustomButton
                className={`p-2 px-5 !rounded-lg text-white !bg-[#1B4DFF]`}
              >
                Thanh toán
              </CustomButton>
              <DotThreeIcon className="mx-5" />
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex justify-between p-3 border-b border-dashed">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#009933] rounded-full" />
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">
                    <span className="text-[#E92215] text-lg font-semibold">
                      1 x{" "}
                    </span>
                    Mỳ cay sường sụn
                  </p>
                  <p className="text-sm text-[#0094FF]">Cấp độ 2</p>
                  <p className="text-sm text-[#666666]">
                    8986 - 28/08/2024 12:22 - Bởi Ngân
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Bàn 2</p>
                <p className="text-sm text-[#666666]">Vừa xong</p>
              </div>
              <div className="flex gap-5">
                <CustomButton type="primary" className=" font-semibold">
                  Chờ chế biến
                </CustomButton>
              </div>
            </div>
            <div className="flex justify-between p-3 border-b border-dashed">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#009933] rounded-full" />
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">
                    <span className="text-[#E92215] text-lg font-semibold">
                      1 x{" "}
                    </span>
                    Mỳ cay sường sụn
                  </p>
                  <p className="text-sm text-[#0094FF]">Cấp độ 2</p>
                  <p className="text-sm text-[#666666]">
                    8986 - 28/08/2024 12:22 - Bởi Ngân
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Bàn 2</p>
                <p className="text-sm text-[#666666]">Vừa xong</p>
              </div>
              <div className="flex gap-5">
                <CustomButton type="primary" className=" font-semibold">
                  Chờ chế biến
                </CustomButton>
              </div>
            </div>
          </div>
        </CustomBoxShadow>
      </div>
    </CustomModal>
  );
};

export default DetailDish;

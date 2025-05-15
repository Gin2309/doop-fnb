import { CustomButton } from "@/components/CustomButton";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import Label from "@/components/CustomLabel";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import Title from "@/components/Title";
import { Divider } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import ArrowLeft from "@/assets/ArrowLeft.svg";

const InventoryDetails = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-between bg-white p-4 shadow-md">
        <p className="text-2xl font-semibold">Thiết lập in</p>
      </div>

      <div className="bg-white mt-5 py-3 px-5 mx-5 rounded-lg flex justify-between items-center">
        <div>
          <div
            className="flex items-center gap-2 py-2 cursor-pointer"
            onClick={() => router.back()}
          >
            <Image src={ArrowLeft} />
            <p>Quay lại mẫu in</p>
          </div>
          <p className="text-2xl font-medium">
            Chỉnh sửa thông tin hiển thị mẫu in 
          </p>
        </div>
        <div className="flex gap-5 items-center">
          <CustomButton
            type="border-color"
            wrapClassName="w-[100px]"
            onClick={() => router.back()}
          >
            Hủy
          </CustomButton>
          <CustomButton type="primary" wrapClassName="w-[100px]">
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-10 bg-[#F2F2F2] mx-5 mt-5 shadow-xl">
        <div className="col-span-5 bg-[#fff] p-5"></div>

        <div className="col-span-5"></div>
      </div>
    </div>
  );
};

export default InventoryDetails;

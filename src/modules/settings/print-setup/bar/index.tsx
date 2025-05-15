import { CustomButton } from "@/components/CustomButton";
import Label from "@/components/CustomLabel";
import { CustomSwitch } from "@/components/CustomSwitch";
import { Divider } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import EditIcon from "@/assets/Pencil.svg";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomInput } from "@/components/CustomInput";

const BarPrint = () => {
  const router = useRouter();
  return (
    <div className="px-5 mt-5">
      <div className="grid grid-cols-10 gap-5">
        <div className="card col-span-6">
          <Label infoText="" label="Thiết lập thông tin chung" />
          <Divider />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-[5px]">
              <Label
                infoText=""
                label="In thông báo mặt hàng bị huỷ đến Bar / Bếp"
                className="font-normal"
              />
              <CustomSwitch />
            </div>
            <div className="flex items-center justify-between py-[5px]">
              <Label
                infoText=""
                label="In riêng phiếu in bếp cho từng mặt hàng"
                className="font-normal"
              />
              <CustomSwitch />
            </div>
            <div className="flex items-center justify-between py-[5px]">
              <Label
                infoText=""
                label="In thông tin bàn/đối tác giao hàng mới trên phiếu in bếp khi thay đổi bàn/đối tác giao hàng"
                className="font-normal"
              />
              <CustomSwitch />
            </div>
          </div>
          <Label infoText="" label="Số liên in phiếu bếp" />

          <div className="flex justify-between">
            <Label infoText="" label="Tên bếp" />
            <Label infoText="" label="Số liên in" />
          </div>

          <div className="bg-[#F4F6F8] flex p-2 items-center">
            <div className="flex-1">
              <Label infoText="" label="Bếp mặc định" />
            </div>
            <div className="flex-1">
              <CustomInput
                onChange={() => {}}
                type="number"
                placeholder=""
                className="w-[100%] h-[44px] flex-1"
              />
            </div>
          </div>
        </div>
        <div className="card col-span-4">
          <div className="flex justify-between ">
            <Label infoText="" label="Xem trước" />
            <CustomButton
              type="border-color"
              wrapClassName="min-w-[100px]"
              prefixIcon={<Image src={EditIcon} />}
              onClick={() => router.push("/settings/print-setup/detail-bar/2")}
            >
              Sửa mẫu in
            </CustomButton>
          </div>

          <Divider />
          <CustomSelect
            options={[
              { value: "1", label: "Khổ giấy 80mm" },
              { value: "2", label: "Khổ giấy 60mm" },
            ]}
            showSearch={true}
            onChange={() => {}}
            value="1"
            className="suffix-icon h-11 !rounded"
            placeholder="Chọn khổ giấy"
          />
        </div>
      </div>
    </div>
  );
};

export default BarPrint;

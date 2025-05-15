import { CustomButton } from "@/components/CustomButton";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomSwitch } from "@/components/CustomSwitch";
import { Divider } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import EditIcon from "@/assets/Pencil.svg";
import { CustomSelect } from "@/components/CustomSelect";

const TemPrint = () => {
  const router = useRouter();
  return (
    <div className="px-5 my-5">
      <div className="grid grid-cols-10 gap-5">
        <div className="card col-span-6">
          <Label infoText="" label="Thiết lập thông tin chung" />
          <Divider />
          <Label
            infoText=""
            label="In tem với loại hình dịch vụ"
            className="font-normal"
          />

          <div className="flex justify-between my-3">
            <CustomCheckbox onChange={() => {}}>
              <strong className="font-light">Ăn tại bàn</strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={() => {}}>
              <strong className="font-light">Mang đi</strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={() => {}}>
              <strong className="font-light">Giao hàng</strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={() => {}}>
              <strong className="font-light">Đối tác</strong>
            </CustomCheckbox>
          </div>
          <p className="text-[13px] italic py-2 text-[#666]">
            Lưu ý: Nếu mặt hàng có thiết lập không in tem, dù loại hình phục vụ
            cho phép in tem, mặt hàng đó cũng sẽ không được in
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between py-[5px]">
              <Label
                infoText=""
                label="Tùy chỉnh hiện thị tên nhà hàng"
                className="font-normal"
              />
              <CustomSwitch />
            </div>

            <div>
              <CustomInput
                onChange={() => {}}
                type="text"
                placeholder=""
                className="w-[100%] h-[44px] flex-1"
              />
            </div>
            <p className="text-[13px] italic py-2 text-[#666]">
              Tối đa 50 ký tự
            </p>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between py-[5px]">
              <Label
                infoText=""
                label="Tùy chỉnh hiện thị tên nhà hàng"
                className="font-normal"
              />
              <CustomSwitch />
            </div>
            <div>
              <CustomInput
                onChange={() => {}}
                type="text"
                placeholder=""
                className="w-[100%] h-[44px] flex-1"
              />
            </div>
          </div>

          <p className="text-[13px] italic py-2 text-[#666]">
            Tối đa 50 ký tự. Chỉ hiển thị trên khổ tem 50x75MM. Hiển thị nội
            dung 1 của chân trang hoá đơn (nếu có)
          </p>
        </div>
        <div className="card col-span-4">
          <div className="flex justify-between ">
            <Label infoText="" label="Xem trước" />
            <CustomButton
              type="border-color"
              wrapClassName="min-w-[100px]"
              prefixIcon={<Image src={EditIcon} />}
              onClick={() => router.push("/settings/print-setup/detail-tem/2")}
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

export default TemPrint;

import { CustomCheckbox } from "@/components/CustomCheckbox";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomSwitch } from "@/components/CustomSwitch";

const InventoryPrint = () => {
  return (
    <div className="px-5 mt-5">
      <div className="grid grid-cols-10 gap-5">
        <div className="card col-span-6">
          <Label infoText="" label="Thiết lập thông tin chung" />

          <div className="flex items-center justify-between py-[10px]">
            <Label
              infoText=""
              label="In tự động sau khi tạo đơn"
              className="font-normal"
            />
            <CustomSwitch />
          </div>

          <CustomCheckbox onChange={() => {}}>
            <strong className="font-light">
              In lại phiếu sau mỗi lần cập nhật món trong đơn
            </strong>
          </CustomCheckbox>

          <div className="flex items-center justify-between py-[10px]">
            <Label
              infoText=""
              label="In riêng phiếu theo từng bếp"
              className="font-normal"
            />
            <CustomSwitch />
          </div>
        </div>
        <div className="card col-span-4">
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

export default InventoryPrint;

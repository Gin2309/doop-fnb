import { CustomInput } from "@/components/CustomInput";
import { DatePicker, Dropdown, MenuProps, Space } from "antd";
import Image from "next/image";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/CustomButton";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";

export default function TableAction({ formFilter, setFormFilter }) {
  const { t } = useTranslation();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span>Mã nhân viên</span>,
    },
    {
      key: "2",
      label: <span>Tên nhân viên</span>,
    },
  ];

  return (
    <div className="flex justify-between">
      <Space.Compact className="flex items-center w-1/3">
        <div className="w-[300px] h-[44px] border-[1px] px-[10px] flex items-center rounded-l-lg border-[#E5E5E5] border-r-0">
          <Dropdown menu={{ items }}>
            <Space>
              <div className="flex items-center">
                <Image src={FilterIcon} />
                <span className=" mx-2 cursor-pointer">Lọc nhân viên</span>
                <Image src={DropIcon} />
              </div>
            </Space>
          </Dropdown>
        </div>
        <CustomInput
          placeholder="Tìm kiếm "
          prefixIcon={<Image src={SearchIcon} alt="" />}
          className="h-[44px]"
          wrapClassName="w-full"
          onChange={() => {}}
        />
      </Space.Compact>

      <div className="flex items-center mb-1 py-2 gap-3 ">
        <CustomButton
          type="export"
          className="!rounded-md"
          prefixIcon={<Image src={Download} />}
        >
          {t("download")}
        </CustomButton>
        <CustomButton
          type="print-btn"
          className="!rounded-md"
          prefixIcon={<Image src={Printer} />}
        >
          {t("In danh sách")}
        </CustomButton>
      </div>
    </div>
  );
}

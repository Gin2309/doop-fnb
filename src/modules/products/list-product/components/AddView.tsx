import { useState, useEffect } from "react";
import { CustomButton } from "@/components/CustomButton";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomModal } from "@/components/CustomModal";
import { fosData } from "@/constants";
import { useTranslation } from "react-i18next";

const AddView = ({
  isOpen,
  onCancel,
  selectedColumns,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  selectedColumns: string[];
  onSave: (newColumns: string[]) => void;
}) => {
  const { t } = useTranslation();
  const [tempSelectedColumns, setTempSelectedColumns] = useState<string[]>([]);
  const defaultUnchangeableColumns = ["name", "channel", "variants"];

  useEffect(() => {
    if (isOpen) {
      setTempSelectedColumns([
        ...selectedColumns,
        ...defaultUnchangeableColumns,
      ]);
    }
  }, [isOpen, selectedColumns]);

  const handleCheckboxChange = (key: string) => {
    if (!defaultUnchangeableColumns.includes(key)) {
      setTempSelectedColumns((prev) =>
        prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
      );
    }
  };

  const handleSave = () => {
    onSave(tempSelectedColumns);
    onCancel();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Tùy chỉnh hiển thị"
      width={650}
      customFooter
    >
      <div className="grid grid-cols-2 gap-5 pb-5">
        {fosData?.map((item: any) => (
          <CustomCheckbox
            key={item.id}
            checked={tempSelectedColumns.includes(item.key)}
            onChange={() => handleCheckboxChange(item.key)}
            disabled={defaultUnchangeableColumns.includes(item.key)}
            style={{
              color: defaultUnchangeableColumns.includes(item.key)
                ? "gray"
                : "inherit",
            }}
          >
            <span className="text-[#000]">{item.title}</span>
          </CustomCheckbox>
        ))}
      </div>
      <div className="flex justify-end w-full gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
        <CustomButton
          outline={true}
          className="!h-11 !w-[120px]"
          type="original"
          onClick={onCancel}
        >
          {t("cancel")}
        </CustomButton>
        <CustomButton
          className="!h-11 !w-[120px]"
          type="primary"
          onClick={handleSave}
        >
          Xong
        </CustomButton>
      </div>
    </CustomModal>
  );
};

export default AddView;

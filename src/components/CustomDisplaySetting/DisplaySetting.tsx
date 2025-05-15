import React, { useState } from "react";
import { Row, Col } from "antd";
import Image from "next/image";
import { CustomModal, SaveButton, CancelButton, CustomTypo } from "./styled";
import { useTranslation } from "react-i18next";
import CloseIcon from "@/assets/closeIcon.svg";
import PencilIcon from "@/assets/pencilIcon.svg";
import { CustomCheckbox } from "../CustomCheckbox";

interface Option {
  label: string;
  checked: boolean;
  disabled: boolean;
}

interface DisplaySettingProps {
  options: Option[] | any[];
  onSave: any;
}

const DisplaySetting: React.FC<DisplaySettingProps> = ({ options, onSave }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [checkedOptions, setCheckedOptions] = useState<Option[]>(options);

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);
  const handleSave = () => {
    if (onSave) {
      onSave(checkedOptions);
    }
    setOpen(false);
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedOptions((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, checked: !option.checked } : option
      )
    );
  };

  return (
    <>
      <CustomTypo onClick={showModal}>
        <Image src={PencilIcon} alt="edit" />
        <span style={{ marginLeft: 5 }}>{t("customizeDisplay")}</span>
      </CustomTypo>
      <CustomModal
        centered
        title={t("customizeDisplay")}
        open={open}
        onCancel={handleCancel}
        footer={[
          <CancelButton key="cancel" onClick={handleCancel}>
            {t("cancel")}
          </CancelButton>,
          <SaveButton key="save" onClick={handleSave}>
            {t("save")}
          </SaveButton>,
        ]}
        closeIcon={<Image src={CloseIcon} alt="close icon" />}
      >
        <Row gutter={[16, 16]}>
          {checkedOptions.map((option, index) => (
            <Col span={12} key={option.label}>
              <CustomCheckbox
                checked={option.checked}
                disabled={option.disabled}
                onChange={() => handleCheckboxChange(index)}
              >
                {t(option.label)}
              </CustomCheckbox>
            </Col>
          ))}
        </Row>
      </CustomModal>
    </>
  );
};

export default DisplaySetting;

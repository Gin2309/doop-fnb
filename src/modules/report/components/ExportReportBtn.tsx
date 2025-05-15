import { Button, ButtonProps } from "antd"
import Image from "next/image"
import Excel from "@/assets/images/excel.png";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

const ExportReportBtn = (props: ButtonProps) => {
  const { t } = useTranslation();

  const {
    children,
    ...restProps
  } = props;
  return <Button
    {...restProps}
    icon={<Image src={Excel} />}
    className={classNames(
      "inline-flex items-center !border-[#107C41] !text-[#107C41] font-[600] px-[12px] py-[10px] !h-auto",
      restProps.className
    )}
  >
    {t('exportReport')}
  </Button>
}

export default ExportReportBtn;
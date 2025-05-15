import { useTranslation } from "react-i18next";
import Payment from "./Payment";
import Tab from "@/components/CustomTab";
import Notification from "./Notification";
import CustomActionHeader from "@/components/CustomActionHeader";
import PackageList from "./ListPackage";

const Package = () => {
  const { t } = useTranslation();

  const tabs = [t("purchasePackage"), t("payment")];

  const components = [
    <PackageList key="purchasePackage" />,
    <Payment key="payment" />,
  ];

  return (
    <>
      <CustomActionHeader title="purchasePackageManagement" type="title" />

      <div className="flex flex-col mb-6">
        <Notification />
        <Payment />,
        {/* <Tab menu={tabs} components={components} defaultIndex={0} /> */}
      </div>
    </>
  );
};

export default Package;

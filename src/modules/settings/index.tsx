import React, { useEffect, useState } from "react";
import Title from "@/components/Title";
import { useTranslation } from "react-i18next";

import Card from "./Card";

import img1 from "@/assets/Setting1.svg";
import img2 from "@/assets/Setting2.svg";
import img3 from "@/assets/Setting3.svg";
import img4 from "@/assets/Setting4.svg";
import img5 from "@/assets/Setting5.svg";
import img6 from "@/assets/Setting6.svg";
import img7 from "@/assets/Setting7.svg";
import img8 from "@/assets/Setting8.svg";
import img9 from "@/assets/Setting9.svg";
import img10 from "@/assets/Setting10.svg";
import img11 from "@/assets/Setting11.svg";

import { useRecoilValue } from "recoil";
import { hasPermission } from "@/helpers";
import { RoleKey } from "./role/role.enum";
import { branchStateSession } from "@/recoil/state";

const Settings = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState<any>([]);

  const branch = useRecoilValue(branchStateSession);

  const functionCards = [
    {
      title: t("functionSetup"),
      children: [
        { img: img3, title: "unitSetup", router: "unit-setup" },
        { img: img4, title: "salesSetup", router: "sales-setup" },
        { img: img5, title: "deviceSetup", router: "device-setup" },
        { img: img6, title: "roomTableSetup", router: "room-table-setup" },
        { img: img7, title: "printSetup", router: "print-setup" },
        { img: img8, title: "paymentMethod", router: "payment-method" },
        { img: img9, title: "eInvoice", router: "e-invoice" },
        { img: img10, title: "reportSetup", router: "report-setup" },
        { img: img11, title: "kitchenSetup", router: "kitchen-setup" },
      ],
    },
  ];
  const items = (permissions: any[]) =>
    [
      hasPermission(permissions, RoleKey.restaurant_info) && {
        title: t("functionSetup"),
        children: [
          { img: img3, title: "unitSetup", router: "unit-setup" },
          { img: img4, title: "salesSetup", router: "sales-setup" },
          { img: img5, title: "deviceSetup", router: "device-setup" },
          { img: img6, title: "roomTableSetup", router: "room-table-setup" },
          { img: img7, title: "printSetup", router: "print-setup" },
          { img: img8, title: "paymentMethod", router: "payment-method" },
          { img: img9, title: "eInvoice", router: "e-invoice" },
          { img: img10, title: "reportSetup", router: "report-setup" },
          { img: img11, title: "kitchenSetup", router: "kitchen-setup" },
        ].filter(Boolean),
      },
    ].filter(Boolean);
  useEffect(() => {
    setMenu(items(branch?.employeeDto?.employeeRole?.permissions));
  }, [branch]);

  return (
    <>
      <Title>{t("settings")}</Title>

      <div className="gap-6 mb-6 flex flex-col">
        {menu?.map((item, index) => (
          <div className="bg-[#fff] p-5 gap-4 rounded-xl shadow-md" key={index}>
            <h1 className="font-semibold uppercase text-[18px] text-[#1A1A1A] mb-4">
              {item?.title}
            </h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {item?.children?.map((child, index) => (
                <Card
                  key={index}
                  img={child?.img}
                  title={child?.title}
                  router={child?.router}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Settings;

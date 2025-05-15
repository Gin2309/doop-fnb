import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { CustomButton } from "@/components/CustomButton";
import Title from "@/components/Title";
import AddModal from "./AddModal";
import Card from "./Card";

import PlusIcon from "@/assets/plusWhiteIcon.svg";

const Support = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 550);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fakeData = [
    {
      id: 1,
      branch: "Doop Lê Văn Lương",
      problem: "Lỗi phần mềm",
      status: "done",
    },
    {
      id: 2,
      branch: "Gemini Coffee",
      problem: "Lỗi thanh toán",
      status: "waitting",
    },
    {
      id: 3,
      branch: "Cộng Cafe Mỹ Đình",
      problem: "Lỗi thiết bị",
      status: "waitting",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>onlineSupport</Title>
        <div>
          <CustomButton
            type="primary"
            wrapClassName="mx-2"
            prefixIcon={<Image src={PlusIcon} />}
            className={`${isSmallScreen ? "no-text" : ""}`}
            onClick={() => setOpen(true)}
          >
            {t("createSupportForm")}
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-[4px] bg-[#fff] flex flex-col gap-4 px-5 py-4 shadow-lg">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] ">
            {t("ticketList")}
          </h1>
          {fakeData.map((item) => (
            <div key={item.id}>
              <Card
                id={item.id}
                branch={item.branch}
                problem={item.problem}
                status={item.status}
              />
            </div>
          ))}
        </div>
        <div className="rounded-[4px] bg-[#fff] shadow-lg px-5 py-4 ">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] ">
            {t("liveChat")}
          </h1>
        </div>
      </div>

      <AddModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onSubmit={() => {}}
      />
    </>
  );
};

export default Support;

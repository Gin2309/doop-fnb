import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CustomButton } from "@/components/CustomButton";
import New from "@/assets/new.svg";
import Pending from "@/assets/pending.svg";
import Verified from "@/assets/DoubleChecks.svg";
import Disable from "@/assets/whiteCloseIcon.svg";
import { useTranslation } from "react-i18next";

interface CardProps {
  status: "ACTIVE" | "UNVERIFY" | "NEW" | "BLOCK";
}

const Card: React.FC<CardProps> = ({ status }) => {
  const { t } = useTranslation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  let icon;
  let textKey;
  let type;

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

  switch (status) {
    case "ACTIVE":
      icon = Verified;
      textKey = "verified";
      type = "verified";
      break;
    case "NEW":
      icon = New;
      textKey = "newlyCreated";
      type = "new";
      break;
    case "UNVERIFY":
      icon = Pending;
      textKey = "pendingVerification";
      type = "pending";
      break;
    case "BLOCK":
      icon = Disable;
      textKey = "disabled";
      type = "disabled";
      break;
    default:
      icon = New;
      textKey = "newlyCreated";
      type = "new";
  }
  return (
    <CustomButton
      prefixIcon={<Image src={icon} />}
      className={`${isSmallScreen ? "no-text" : ""} ${type}`}
      onClick={() => {}}
    >
      {t(textKey)}
    </CustomButton>
  );
};

export default Card;

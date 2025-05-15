import React from "react";
import { message } from "antd";
import { CustomSwitch } from "@/components/CustomSwitch";

import { useMutation } from "@tanstack/react-query";
import { updateSaleConfig } from "@/api/sale-config.service";

const Card = ({ type, value, desc, valueKey, configType, branchId }) => {
  const { mutate: updateMutation, isLoading } = useMutation(
    (data: any) => updateSaleConfig(data),
    {
      onSuccess: () => {
        message.success("Cập nhật thành công");
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = () => {
    const submittedData = {
      key: valueKey,
      description: desc,
      valueType: type,
      value,
      branchId,
      configType,
    };

    updateMutation(submittedData);
  };

  return (
    <div className="bg-white rounded-xl flex flex-col p-5 gap-4 shadow-md">
      <div>
        <h1 className="text-[#1A1A1A] font-semibold text-[16px] uppercase mb-2">
          {value}
        </h1>
        <h2 className="text-[#333333] text-[14px]">{desc}</h2>
      </div>

      <div className="border-[1px] border-[#ccc]"></div>

      <div className="flex gap-3 items-center">
        <h2 className="text-[#2D3643] font-medium text-[14px]">{valueKey}</h2>

        <CustomSwitch />
      </div>
    </div>
  );
};

export default Card;

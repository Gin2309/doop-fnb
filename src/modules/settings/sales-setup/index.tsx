import React from "react";

import { Skeleton } from "antd";
import CustomActionHeader from "@/components/CustomActionHeader";
import Card from "./Card";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

import { useQuery } from "@tanstack/react-query";
import { getSaleConfig } from "@/api/sale-config.service";

const SaleSetup = () => {
  const branch = useRecoilValue(branchStateSession);

  const { data, isLoading } = useQuery(["SALE_CONFIG"], () =>
    getSaleConfig(branch?.id)
  );

  return (
    <>
      <div>
        <CustomActionHeader type="save" title="Thiết lập bán hàng" />

        <div>
          {isLoading ? (
            <Skeleton active />
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {data?.data?.map((item: any, index: number) => (
                  <div key={index}>
                    <Card
                      value={item.value}
                      type={item.valueType}
                      desc={item.description}
                      valueKey={item.key}
                      configType={item.configType}
                      branchId={branch.id}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SaleSetup;

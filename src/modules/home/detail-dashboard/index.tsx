import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(quarterOfYear);

import { CustomSelect } from "@/components/CustomSelect";
import ListOverBillTop from "./overview-bill/ListTop";

import ShuffleAngular from "@/assets/shuffleAngular.svg";
import { useQuery } from "@tanstack/react-query";
import { getOverviewBill, getOverviewByTime } from "@/api/overview.service";
import ListOverViewTime from "./overview-time/List";
import ListOverBillBot from "./overview-bill/ListBot";
import LineChart from "./overview-time/Table";
import { calculateDifference, isValidFilter } from "@/helpers/helpers";
import { ListOverviewCurrentBill } from "./overview-current-bill/List";
import { ListOverviewEmployee } from "./overview-employe/List";
import { ListOverviewProduct } from "./overview-product/List";
import { OverviewCategory } from "./overview-category/Table";
import { useDateRange } from "@/helpers/useDateRange";

export function DetailDashboard({ id }) {
  const { t } = useTranslation();

  const {
    currentDate,
    formFilter,
    comparisonFilter,
    comparisonType,
    setComparisonType,
  } = useDateRange(id);

  const { data, isLoading } = useQuery(
    [`BILL_OVERVIEW`, formFilter],
    () => getOverviewBill(formFilter),
    {
      enabled: Boolean(isValidFilter(formFilter)),
    }
  );

  const { data: prevData, isLoading: prevLoading } = useQuery(
    [`BILL_OVERVIEW_PREVIOUS`, comparisonFilter],
    () => getOverviewBill(comparisonFilter),
    {
      enabled: Boolean(isValidFilter(comparisonFilter)),
    }
  );

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <CustomSelect
          prefixIcon={<Image src={ShuffleAngular} />}
          className="h-11"
          style={{ width: "24%" }}
          options={[
            { label: "Hôm nay", value: "day" },
            { label: "Tháng hiện tại", value: "month" },
            { label: "Năm hiện tại", value: "year" },
          ]}
          value={comparisonType}
          onChange={setComparisonType}
        />
      </div>

      <ListOverBillTop
        data={data}
        prevData={prevData}
        isLoading={isLoading || prevLoading}
        calculateDifference={calculateDifference}
        comparisonType={comparisonType}
      />

      <div className="flex flex-col xl:grid grid-cols-4 mt-5  gap-5">
        <div className="col-span-3">
          <ListOverBillBot
            data={data}
            prevData={prevData}
            isLoading={isLoading || prevLoading}
            calculateDifference={calculateDifference}
          />
          <div className="flex-1 h-full max-h-[400px] overflow-hidden mt-5">
            <LineChart formFilter={formFilter} />
          </div>
        </div>
        <ListOverViewTime formFilter={currentDate} />
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5">
        <ListOverviewCurrentBill formFilter={formFilter} />

        <ListOverviewEmployee
          formFilter={formFilter}
          comparisonFilter={comparisonFilter}
        />

        <ListOverviewProduct
          title="bestSeller"
          formFilter={formFilter}
          comparisonFilter={comparisonFilter}
        />

        <OverviewCategory formFilter={formFilter} />
      </div>
    </div>
  );
}

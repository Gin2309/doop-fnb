import { Form, FormInstance } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";

export type RevenueFormData = {
  range: [number, number];
  hourIndex: number;
}

export function useReportDateRangeFilter(form: FormInstance<RevenueFormData>, branchId: any) {
  const now = useMemo(() => dayjs(), []);
  const currentRange = Form.useWatch("range", form);
  const currentHourIndex = Form.useWatch("hourIndex", form);
  

  const showHourSelect = useMemo(() => {
    if (!currentRange || !currentRange[0] || !currentRange[1]) return false;
    const start = dayjs(currentRange[0]);
    const end = dayjs(currentRange[1]);
    return end.isSame(start, "day");
  }, [currentRange]);

  const formFilter = useMemo(() => {
      if (!currentRange || !currentRange[0] || !currentRange[1]) return {
        current: { 
          branchId: Number(branchId)
        },
        prev: {
          branchId: Number(branchId)
        }
      };
      const start = dayjs(currentRange[0]).startOf("day");
      const end = dayjs(currentRange[1]).endOf("day");
      let timeStart = start.format("YYYY-MM-DD HH:mm:ss");
      let timeEnd = end.format("YYYY-MM-DD HH:mm:ss");
      let timeEndPrev = end.clone().subtract(1, "day").endOf("day").format("YYYY-MM-DD HH:mm:ss");
      const diff = end.diff(start, "day");
      let timeStartPrev = end.clone().subtract(1 + diff, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss");
  
      if (!diff) {
        if (typeof currentHourIndex === "number") {
          timeStart = start.clone().startOf("day").add(currentHourIndex, "hour").format("YYYY-MM-DD HH:mm:ss");
          timeEnd = start.clone().startOf("day").add(currentHourIndex + 1, "hour").format("YYYY-MM-DD HH:mm:ss");
          if (currentHourIndex === 0) {
            timeStartPrev = start.clone().subtract(1, "day").endOf("day").startOf("hour").format("YYYY-MM-DD HH:mm:ss");
            timeEndPrev = start.clone().subtract(1, "day").endOf("day").format("YYYY-MM-DD HH:mm:ss");
          }
        }
      }
      return {
        current: {
          branchId: Number(branchId),
          from: timeStart,
          to: timeEnd,
        },
        prev: {
          branchId: Number(branchId),
          from: timeStartPrev,
          to: timeEndPrev,
        }
      };
    }, [branchId, currentRange, currentHourIndex]);

  return {
    now,
    formFilter,
    showHourSelect
  }
}
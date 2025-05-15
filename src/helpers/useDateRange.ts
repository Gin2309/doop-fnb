import { useState, useEffect } from "react";
import dayjs from "dayjs";

type ComparisonType = "day" | "week" | "month" | "year";

export const useDateRange = (id: string) => {
  const [currentDate, setCurrentDate] = useState({
    branchId: Number(id),
    from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  });

  const [formFilter, setFormFilter] = useState({
    branchId: Number(id),
    from: "",
    to: "",
  });

  const [comparisonFilter, setComparisonFilter] = useState({
    branchId: Number(id),
    from: "",
    to: "",
  });

  const [comparisonType, setComparisonType] = useState<ComparisonType>("day");

  const isValidComparisonType = (type: string): type is ComparisonType => {
    return ["day", "week", "month", "year"].includes(type);
  };

  const getDateRange = (type: ComparisonType) => {
    const now = dayjs();
    return {
      from: now.startOf(type).format("YYYY-MM-DD 00:00:00"),
      to: now.endOf(type).format("YYYY-MM-DD 23:59:59"),
    };
  };

  const getComparisonRange = (type: ComparisonType) => {
    const now = dayjs();
    return {
      from: now.subtract(1, type).startOf(type).format("YYYY-MM-DD 00:00:00"),
      to: now.subtract(1, type).endOf(type).format("YYYY-MM-DD 23:59:59"),
    };
  };

  useEffect(() => {
    if (isValidComparisonType(comparisonType)) {
      const { from, to } = getDateRange(comparisonType);
      setFormFilter((prev) => ({ ...prev, from, to }));

      const { from: compFrom, to: compTo } = getComparisonRange(comparisonType);
      setComparisonFilter((prev) => ({
        ...prev,
        from: compFrom,
        to: compTo,
      }));
    } else {
      console.error("Invalid comparisonType:", comparisonType);
    }
  }, [comparisonType]);

  return {
    currentDate,
    setCurrentDate,
    formFilter,
    setFormFilter,
    comparisonFilter,
    setComparisonFilter,
    comparisonType,
    setComparisonType,
  };
};

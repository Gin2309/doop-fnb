export const isValidFilter = (filter) => {
  return Boolean(filter?.from && filter?.to);
};

export const calculateChange = (current, previous) => {
  if (current === 0 && previous === 0) {
    return { percentage: 0, color: "#999" };
  }

  if (!previous || previous === 0) {
    return { percentage: 100, color: "#009933" };
  }

  const percentage = ((current - previous) / previous) * 100;

  const color =
    percentage > 0 ? "#009933" : percentage < 0 ? "#FF5C00" : "#999";

  return { percentage, color };
};

export const calculateDifference = (currentValue, previousValue) => {
  previousValue = previousValue ?? 0;

  if (currentValue === 0 && previousValue === 0) {
    return 0;
  }

  if (previousValue === 0) {
    return 100;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
};

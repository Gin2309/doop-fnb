import { useState } from "react";
import TableAction from "./TableAction";
import TableContent from "./TableContent";
import dayjs from "dayjs";

export default function TableTimeSheet() {
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("month"));

  return (
    <div>
      <TableAction
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <TableContent selectedDate={selectedDate} />
    </div>
  );
}

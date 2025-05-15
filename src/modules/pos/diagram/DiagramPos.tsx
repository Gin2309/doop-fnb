import { useTranslation } from "react-i18next";

import InvoicePosContent from "./DiagramPosContent";

export default function DiagramPos({
  data,
  seenOption,
  setSeenOption,
  positionData,
  isLoading,
}: {
  data: any;
  seenOption: any;
  setSeenOption: any;
  positionData: any;
  isLoading: any;
}) {
  const { t } = useTranslation();

  const handleSeenOptionChange = (option: string) => {
    setSeenOption(option);
  };

  return (
    <div>
      <div className=" bg-white border-b px-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 h-full pr-8  py-5">
          <div className="flex bg-slate-100 min-w-[250px] p-1 rounded-md gap-[10px]">
            <button
              className={`rounded-md px-2 py-1 flex-1 ${
                seenOption === "EXTEND"
                  ? "bg-white text-[#FF5C00]"
                  : "bg-transparent"
              }`}
              onClick={() => handleSeenOptionChange("EXTEND")}
            >
              Trực quan
            </button>
            <button
              className={`rounded-md px-2 py-1 flex-1 ${
                seenOption === "MINIMIZE"
                  ? "bg-white text-[#FF5C00]"
                  : "bg-transparent"
              }`}
              onClick={() => handleSeenOptionChange("MINIMIZE")}
            >
              Thu nhỏ
            </button>
          </div>
          <div className="grid grid-cols-3 lg:flex lg:flex-wrap gap-8 ">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-[#E5E5E5] rounded-full flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <p>Bàn trống ({data?.blankCount})</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-[#FEE9DA] rounded-full flex-shrink-0">
                <div className="w-3 h-3 bg-[#FF5C00] rounded-full" />
              </div>
              <p>Đặt trước ({data?.bookCount})</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-[#d9f6ea] rounded-full flex-shrink-0">
                <div className="w-3 h-3 bg-[#148C4B] rounded-full" />
              </div>
              <p>Đang sử dụng ({data?.usedCount})</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-[#d9f6ea] rounded-full flex-shrink-0">
                <div className="w-3 h-3 bg-[#3942E0] rounded-full" />
              </div>
              <p>Đang sử dụng + Thẻ tháng (0)</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-[#d9f6ea] rounded-full flex-shrink-0">
                <div className="w-3 h-3 bg-[#E50000] rounded-full" />
              </div>
              <p>Đang sử dụng + Yêu cầu thanh toán (0)</p>
            </div>
          </div>
        </div>
      </div>

      <InvoicePosContent
        data={positionData}
        seenOption={seenOption}
        isLoading={isLoading}
      />
    </div>
  );
}

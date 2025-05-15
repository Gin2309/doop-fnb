import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "../CustomSelect";
import { PaginationStyled } from "./styled";

export default function CustomPagination({
  page,
  pageSize,
  total,
  setPage = () => {},
  setPerPage = () => {},
}: {
  page: number;
  pageSize: number;
  total: number;
  setPage?: (value: number) => void;
  setPerPage?: (value: number) => void;
}) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(total / pageSize);

  const isDisabledPrev = totalPages === 1 || page === 1;
  const isDisabledNext = totalPages === 1 || page === totalPages;

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M14.298 5.98828L8.28796 11.9983L14.298 18.0083L15.712 16.5943L11.116 11.9983L15.712 7.40228L14.298 5.98828Z"
            fill={isDisabledPrev ? "#E8EAEB" : "#000000"}
          />
        </svg>
      );
    }

    if (type === "next") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.70209 18.0102L15.7121 12.0002L9.70209 5.99023L8.28809 7.40423L12.8841 12.0002L8.28809 16.5962L9.70209 18.0102Z"
            fill={isDisabledNext ? "#E8EAEB" : "#000000"}
          />
        </svg>
      );
    }

    return originalElement;
  };

  return (
    <PaginationStyled
      className={`flex 2xs:flex-col sm:flex-row items-center justify-between gap-3 rounded-b-xl bg-white pt-4`}
    >
      <div className="flex items-center font-semibold text-[#666666] gap-x-3">
        <div>{t("itemsPerPage")}</div>

        <CustomSelect
          value={pageSize}
          wrapClassName="!w-[80px]"
          className=" !rounded-md"
          options={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
          onChange={(value) => {
            setPerPage(value);
          }}
        />
      </div>

      <div className="flex justify-end gap-[10px]">
        {/* Nút quay về trang đầu */}
        <span
          className={`w-[32px] h-[32px] border-[#ccc] rounded-[8px] border-[1px] flex justify-center items-center ${
            isDisabledPrev ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (page > 1) setPage(1);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7265 12L12.6665 11.06L9.61317 8L12.6665 4.94L11.7265 4L7.7265 8L11.7265 12Z"
              fill={isDisabledPrev ? "#E8EAEB" : "black"}
            />
            <path
              d="M7.33344 12L8.27344 11.06L5.2201 8L8.27344 4.94L7.33344 4L3.33344 8L7.33344 12Z"
              fill={isDisabledPrev ? "#E8EAEB" : "black"}
            />
          </svg>
        </span>

        {/* Phân trang */}
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          itemRender={itemRender}
          showQuickJumper={false}
          onChange={(value) => setPage(value)}
        />

        {/* Nút đi đến trang cuối */}
        <span
          className={`w-[32px] h-[32px] border-[#ccc] rounded-[8px] border-[1px] flex justify-center items-center ${
            isDisabledNext ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (page < totalPages) setPage(totalPages);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.2735 4L3.3335 4.94L6.38683 8L3.3335 11.06L4.2735 12L8.2735 8L4.2735 4Z"
              fill={isDisabledNext ? "#E8EAEB" : "black"}
            />
            <path
              d="M8.66656 4L7.72656 4.94L10.7799 8L7.72656 11.06L8.66656 12L12.6666 8L8.66656 4Z"
              fill={isDisabledNext ? "#E8EAEB" : "black"}
            />
          </svg>
        </span>
      </div>
    </PaginationStyled>
  );
}

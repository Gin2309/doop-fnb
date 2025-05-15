import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import _debounce from "lodash/debounce";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";
import AddModal from "./add/AddModal";
import SearchIcon from "@/assets/searchIcon.svg";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import EditIcon from "@/assets/editBlue.svg";
import DeleteIcon from "@/assets/deleteRed.svg";
import { formatNumber } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUnit, getUnit } from "@/api/unit.service";
import { branchStateSession } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { message } from "antd";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import { CustomInput } from "@/components/CustomInput";

interface UnitRecord {
  key: number;
  unit: string;
  item: number;
  material: number;
}

const Unit = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [itemSelect, setItemSelect] = useState(null);
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
  const branch = useRecoilValue(branchStateSession);
  const queryClient = useQueryClient();
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const [formFilter, setFormFilter] = useState({
    limit: 20,
    page: 1,
    branchId: branch?.id,
    status: undefined,
    role: "",
    keyword: "",
  });

  const {
    data: units,
    isLoading,
    isError,
  } = useQuery(["UNIT", formFilter], () => getUnit(formFilter));

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deleteUnit(Number(itemSelect));
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["EMPLOYEE"]);
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const columns: ColumnsType<UnitRecord> = [
    {
      title: t("unit"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("itemUsageQuantity"),
      dataIndex: "countProduct",
      key: "countProduct",
      align: "center",
      render: (value: number) => formatNumber(value),
    },
    // {
    //   title: t("materialUsageQuantity"),
    //   dataIndex: "countMaterial",
    //   key: "countMaterial",
    //   align: "center",
    //   render: (value: number) => formatNumber(value),
    // },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (value: string, { id, name }: any) => {
        return (
          <>
            <div className="flex gap-2 justify-center">
              <div
                onClick={() => {
                  setItemSelect(id);
                  setShowDeleteNoti({
                    visible: true,
                    content: `Xóa ${name}`,
                  });
                }}
              >
                <Image src={DeleteIcon} />
              </div>
              <div
                onClick={() => {
                  setItemSelect(id);
                  setOpen(true);
                }}
              >
                <Image src={EditIcon} />
              </div>
            </div>
          </>
        );
      },
    },
  ];

  const handleDelete = () => {
    mutateDelete();
  };

  return (
    <>
      <div className="flex justify-between bg-white p-4 shadow-md">
        <p className="text-2xl font-semibold">{t("unitSetup")}</p>
        <CustomButton
          type="primary"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => {
            setOpen(true);
            setItemSelect(null);
          }}
          className={`${isSmallScreen ? "no-text" : ""}`}
        >
          Thêm danh mục
        </CustomButton>
      </div>

      <div className="bg-white 2xs:p-4 md:p-6 rounded-xl mt-5 mx-10">
        <div className="mb-5 w-[350px]">
          <CustomInput
            placeholder="Tìm kiếm đơn vị"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            onChange={_debounce((value) => {
              setFormFilter((preValue) => ({
                ...preValue,
                keyword: value,
              }));
            }, 300)}
          />
        </div>

        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={units?.data?.content?.map((item: any, index) => ({
            ...item,
            key: item.id,
          }))}
          columns={columns}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination
          page={formFilter.page}
          pageSize={formFilter.limit}
          setPage={(value) => setFormFilter({ ...formFilter, page: value })}
          setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
          total={units?.data?.totalElements}
        />
      </div>

      <AddModal
        onCancel={() => {
          setOpen(false);
          setItemSelect(null);
        }}
        onSubmit={() => {}}
        isOpen={open}
        itemSelect={itemSelect}
      />

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti.visible}
          setIsVisible={setShowDeleteNoti}
          title="Bạn có chắc chắn muốn xóa?"
          content={showDeleteNoti.content}
          type="warn"
          onSubmit={handleDelete}
        />
      )}
    </>
  );
};

export default Unit;

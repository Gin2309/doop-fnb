import { CustomButton } from "@/components/CustomButton";
import Title from "@/components/Title";
import Image from "next/image";
import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomInput } from "@/components/CustomInput";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import CustomPagination from "@/components/CustomPagination";
import { useRouter } from "next/router";
import { useState } from "react";
import AddCategory from "./components/Addcategory";
import { branchStateSession } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory } from "@/api/category.service";
import {
  deleteManySelectionGroup,
  getSelectionGroup,
} from "@/api/selection-group.service";
import _debounce from "lodash/debounce";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import DeleIcon from "@/assets/deleteRed.svg";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";

interface IRecord {
  key: number;
  title: string;
  quantity: number;
}

const ProductSelectionGroup = () => {
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [formFilter, setFormFilter] = useState({
    limit: 20,
    page: 1,
    branchId: branch?.id,
    keyword: "",
  });

  const {
    data: selectionGroup,
    isLoading,
    isError,
  } = useQuery(["SELECTION_GROUP", formFilter], () =>
    getSelectionGroup(formFilter)
  );

  const mutation = useMutation({
    mutationFn: (ids: number[] | any) =>
      deleteManySelectionGroup(ids, branch?.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["SELECTION_GROUP"]);
      setOpenDeleteModal(false);
      message.success("Xóa thành công!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const handleDelete = () => {
    mutation.mutate(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const columns: ColumnsType<IRecord> = [
    {
      title: (
        <div className="flex items-start justify-start">
          {selectedRowKeys?.length > 0 && (
            <div
              className=" absolute left-4 bottom-2 cursor-pointer"
              onClick={() => setOpenDeleteModal(true)}
            >
              <Image src={DeleIcon} />
            </div>
          )}
        </div>
      ),
      width: 50,
      dataIndex: "channel",
      key: "channel",
    },
    {
      title: "Tên nhóm lựa chọn",
      dataIndex: "name",
      align: "start",
      key: "name",
      render: (value: string, { id }: any) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
          onClick={() => {
            router.push(`/products/selection-group/${id}`);
          }}
        >
          {value}
        </button>
      ),
    },
    {
      title: "Số lượng mặt hàng",
      dataIndex: "countProduct",
      align: "end",
      key: "countProduct",
    },
  ];

  return (
    <>
      <div className="flex justify-between bg-white p-4 shadow-md">
        <p className="text-2xl font-semibold">Nhóm lựa chọn</p>
        <CustomButton
          type="primary"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push("/products/selection-group/add")}
        >
          Thêm nhóm lựa chọn
        </CustomButton>
      </div>
      <CustomCardItem className="mx-5">
        <div className="p-5 mb-20 mt-4 n">
          <div className="flex flex-col gap-5 lg:flex-row justify-between mb-8">
            <CustomInput
              placeholder="Tìm kiếm nhóm lựa chọn"
              className="w-[426px] h-[36px]"
              onChange={_debounce((value) => {
                setFormFilter((preValue) => ({
                  ...preValue,
                  keyword: value,
                }));
              }, 300)}
              prefixIcon={<Image src={SearchIcon} />}
            />

            <div className="flex gap-[10px]">
              <CustomButton
                type="download-btn"
                prefixIcon={<Image src={Download} />}
              >
                {t("download")}
              </CustomButton>

              <CustomButton
                type="print-btn"
                prefixIcon={<Image src={Printer} />}
              >
                {t("printList")}
              </CustomButton>
            </div>
          </div>

          <CustomTable
            rowSelection={{
              type: "checkbox",
              onChange: (selectedRowKeys: number[] | any) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
            dataSource={selectionGroup?.data?.content?.map(
              (item: any, index) => ({
                ...item,
                key: item.id,
              })
            )}
            columns={columns}
            rowClassName={() => "hover-row"}
          />

          <CustomPagination
            page={formFilter.page}
            pageSize={formFilter.limit}
            setPage={(value) => setFormFilter({ ...formFilter, page: value })}
            setPerPage={(value) =>
              setFormFilter({ ...formFilter, limit: value })
            }
            total={selectionGroup?.data?.totalElements}
          />
        </div>
      </CustomCardItem>
      {openDeleteModal && (
        <DeleteModal
          isOpen={openDeleteModal}
          onCancel={() => setOpenDeleteModal(false)}
          content="những lựa chọn"
          onSuccess={handleDelete}
        />
      )}
    </>
  );
};

export default ProductSelectionGroup;

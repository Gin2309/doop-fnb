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
import { deleteManyCategory, getCategory } from "@/api/category.service";
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

const ProductCategories = () => {
  const router = useRouter();
  const [addModalCategory, setAddModalCategory] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);
  const { t } = useTranslation();

  const [formFilter, setFormFilter] = useState({
    limit: 20,
    page: 1,
    branchId: branch?.id,
    status: undefined,
    role: "",
    keyword: "",
  });

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery(["CATEGORY", formFilter], () => getCategory(formFilter));

  const mutation = useMutation({
    mutationFn: (ids: number[] | any) => deleteManyCategory(ids, branch?.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["CATEGORY"]);
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
      title: "Tên danh mục",
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
            router.push(`/products/categories/${id}`);
          }}
        >
          <p className="block text-line-1"> {value}</p>
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
        <p className="text-2xl font-semibold">Danh mục</p>
        <CustomButton
          type="primary"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => setAddModalCategory(true)}
        >
          Thêm danh mục
        </CustomButton>
      </div>
      <CustomCardItem className="mx-5">
        <div className="p-5 mb-20 mt-4 ">
          <div className="flex flex-col gap-5 lg:flex-row justify-between mb-8">
            <CustomInput
              placeholder="Tìm kiếm danh mục"
              className="w-full lg:w-[426px] h-[40px] "
              onChange={(e) => {
                setFormFilter({ ...formFilter, keyword: e });
              }}
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
            dataSource={categories?.data?.content?.map((item: any, index) => ({
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
            setPerPage={(value) =>
              setFormFilter({ ...formFilter, limit: value })
            }
            total={categories?.data?.totalElements}
          />
        </div>
      </CustomCardItem>
      {addModalCategory && (
        <AddCategory
          isOpen={addModalCategory}
          onCancel={() => setAddModalCategory(false)}
        />
      )}

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

export default ProductCategories;

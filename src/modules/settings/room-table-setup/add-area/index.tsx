import React, { useEffect } from "react";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { Divider, message, Space } from "antd";
import Title from "@/components/Title";
import { CustomButton } from "@/components/CustomButton";
import Label from "@/components/CustomLabel";
import { CustomInput } from "@/components/CustomInput";
import Card from "./components/card/Card";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import NotFound from "@/assets/images/TableNotFound.png";
import Qr from "@/assets/QrIcon.svg";
import { schemaArea } from "./schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputError from "@/components/InputError";
import {
  createArea,
  deleteArea,
  getDetailArea,
  updateArea,
} from "@/api/area.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import useWindowSize from "@/hooks/useWindowSize";

const AddArea = ({ id }: { id?: string }) => {
  const { t } = useTranslation();
  const isSmallScreen = useWindowSize();
  const [seenOption, setSeenOption] = useState("EXTEND");
  const branch = useRecoilValue(branchStateSession);
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: areaDetail, isLoading: loadingArea } = useQuery(
    ["AREA", id, branch.id],
    () => getDetailArea(Number(id), Number(branch.id)),
    { enabled: !!id && !!branch.id }
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schemaArea),
    mode: "onChange",
    defaultValues: {
      seenOption: "EXTEND",
    },
  });

  useEffect(() => {
    if (areaDetail?.data) {
      reset(areaDetail?.data);
      setSeenOption(areaDetail?.data.seenOption);
    }
  }, [areaDetail, reset]);

  const { mutate: deleteAreaMutation } = useMutation(
    () => {
      return deleteArea(Number(id), branch.id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["AREA"]);
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
        message.success("Xóa khu vực thành công!");
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const handleDelete = () => {
    deleteAreaMutation();
    router.back();
  };

  const handleSeenOptionChange = (option: string) => {
    setSeenOption(option);
    setValue("seenOption", option);
  };

  const { mutate: mutate, isLoading: isLoadingMutate } = useMutation(
    (data) => {
      const payload: any = data;

      return areaDetail?.data
        ? updateArea(areaDetail?.data?.id, payload)
        : createArea(payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["AREA"]);
        if (!areaDetail) {
          message.success("Thêm mới thành công");
        } else {
          message.success("Cập nhật thành công");
        }
        router.back();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = async (data: any) => {
    const payload = {
      branchId: branch?.id,
      ...data,
    };

    mutate(payload);
  };

  const locale = {
    emptyText: (
      <div className="text-center items-center flex flex-col">
        <Image src={NotFound} alt="No Data" />
        <div className="my-5">
          <p className="text-[#333333] mb-2 font-semibold text-lg">
            {t("noRoomOrTableInArea")}
          </p>
        </div>
        <CustomButton
          type="primary"
          wrapClassName="mx-2 w-[201px]"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => {
            router.push(
              `/settings/room-table-setup/add-area/add-table?areaId=${id}`
            );
          }}
        >
          {t("addMoreRoomOrTable")}
        </CustomButton>
      </div>
    ),
  };

  return (
    <>
      <div className="bg-white border-t-[1px] h-[72px] shadow-lg flex justify-between gap-[50px] items-center px-[20px] w-[calc(100% + 70px)] mx-[-35px]">
        <Title>
          {areaDetail?.data ? `${areaDetail.data.name}` : "Thêm mới khu vực"}
        </Title>

        <Space>
          <CustomButton
            type="original"
            wrapClassName="w-[100px]"
            onClick={() => router.back()}
          >
            Hủy
          </CustomButton>
          {areaDetail?.data && (
            <CustomButton
              type="danger"
              wrapClassName="min-w-[120px]"
              onClick={() =>
                setShowDeleteNoti({
                  visible: true,
                  content: `Xóa ${getValues("name")}`,
                })
              }
            >
              Xóa khu vực
            </CustomButton>
          )}
          <CustomButton
            type="primary"
            wrapClassName="w-[100px]"
            disabled={isLoadingMutate}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </CustomButton>
        </Space>
      </div>

      <div className="card flex flex-col mt-7">
        <div>
          <Label infoText="" label={t("areaName")} required />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="mb-4">
                <CustomInput
                  {...field}
                  type="text"
                  placeholder="Nhập tên khu vực"
                  className="w-[100%] h-[44px] flex-1"
                />
                <InputError error={errors.name?.message} />
              </div>
            )}
          />
        </div>

        <div className="flex justify-between gap-[10px] mt-3">
          <div>
            {loadingArea ? (
              <></>
            ) : areaDetail?.data?.positions?.length === 0 ? (
              <></>
            ) : (
              <div className="flex">
                <CustomButton
                  type="border-color"
                  wrapClassName="mx-2"
                  prefixIcon={<Image src={Qr} />}
                  className={`${isSmallScreen ? "no-text" : ""}`}
                >
                  {t("getQr")}
                </CustomButton>

                <CustomButton
                  type="primary"
                  wrapClassName="mx-2"
                  prefixIcon={<Image src={PlusIcon} />}
                  className={`${isSmallScreen ? "no-text" : ""}`}
                  onClick={() =>
                    router.push(
                      `/settings/room-table-setup/add-area/add-table?areaId=${id}`
                    )
                  }
                >
                  {t("addRoomTable")}
                </CustomButton>
              </div>
            )}
          </div>

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
        </div>

        <Divider className="border-[1px] border-[#B2B2B2] my-4" />
        <div>
          {areaDetail?.data?.positions.length === 0 ? (
            locale.emptyText
          ) : (
            <div className="gap-5 flex flex-wrap justify-start mx-auto">
              {(areaDetail?.data?.positions || []).map((item, index) => (
                <div key={index} className="text-left">
                  <Card data={item} seenOption={seenOption} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti?.visible}
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

export default AddArea;

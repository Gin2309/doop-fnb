import Image from "next/image";
import { useRouter } from "next/router";
import { Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useRef, useState } from "react";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { message } from "antd";
import CustomTab from "../components/CustomTab";

import ModalCustomer from "@/modules/customers/list/components/ModalAddCustomer";
import { formatTimeCreateAtPOS } from "@/utils";
import Bill from "./Bill";
import Choosing from "./Choosing";
import Used from "./Used";

import ArrowRight from "@/assets/chevron-right.svg";
import EyePos from "@/assets/EyePos.svg";
import PlusCircleIcon from "@/assets/PlusCircle.svg";

import { updateCurrentBill } from "@/api/area-pos.service";
import { getCustomerList } from "@/api/customer.service";
import { branchStateSession } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { getBranchBankAccounts } from "@/api/config-payment.service";

export type ActionMenuProps = {
  open?: boolean;
  data: any;
  productChoosing: any;
  setProductChoosing: any;
  setOpenListPosition: any;
  setTypePosition: any;
  productSplitChecked: any;
  setProductSplitChecked: any;
  handleOpenSplit: any;
  refetch?: any;
  setTransferItem?: any;
  setOpenTransferItem?: any;
}

export type ActionMenuRef = {
  setSelectTab: Dispatch<SetStateAction<number>>;
}

const ActionMenu = forwardRef<ActionMenuRef, ActionMenuProps>(({
  open,
  data,
  productChoosing,
  setProductChoosing,
  setOpenListPosition,
  setTypePosition,
  productSplitChecked,
  setProductSplitChecked,
  handleOpenSplit,
  refetch,
  setTransferItem,
  setOpenTransferItem,
}, ref) => {
  const divRef = useRef<HTMLDivElement>(null);
  const branch = useRecoilValue(branchStateSession);
  const router = useRouter();
  const branchId = Number(branch?.id);
  const [selectTab, setSelectTab] = useState(1);
  const queryClient = useQueryClient();
  const [formUpdateCurrentBill, setFormUpdateCurrentBill] = useState({
    customerId: data?.currentBill?.customerId || null,
    customerNo: data?.currentBill?.customerNo || 1,
  });
  const [openModalCustomer, setOpenModalCustomer] = useState(false);
  const [editCustomer, setEditCustomer] = useState(false);
  const [openBill, setOpenBill] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      setSelectTab
    }
  })

  useEffect(() => {
    setFormUpdateCurrentBill({
      customerId: data?.currentBill?.customerId || null,
      customerNo: data?.currentBill?.customerNo || 1,
    });
  }, [data]);

  useEffect(() => {
    if (router.query.edit === "true") {
      setOpenModalCustomer(true);
      setEditCustomer(true);
    }
    if (router.query.payment === "true") {
      setOpenBill(true);
    }
  }, [router.query.edit]);

  const tabs = ["Đang chọn", "Đã sử dụng"];

  const { data: customers } = useQuery(["CUSTOMER"], () =>
    getCustomerList({
      page: 1,
      limit: 9999,
      keyword: "",
      branchId: branchId,
    })
  );

  const { mutate: mutate } = useMutation(
    (data: any) => {
      return updateCurrentBill(data.currentBillId, data);
    },
    {
      onSuccess: async () => {
        // setProductChoosing([]);
        await queryClient.invalidateQueries(["DETAIL_POSITION"]);
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const { data: accountData } = useQuery(
    [
      "BANK_ACCOUNTS",
      branchId,
      refetch
    ],
    () => getBranchBankAccounts({
      // TODO: Get Correct Branch
      branchId
    }),
    {
      enabled: !!branchId && !isNaN(branchId),
    }
  );

  const timeoutRef = useRef<any>(null);

  const handleCustomerNoChange = (action: "increment" | "decrement") => {
    clearTimeout(timeoutRef.current);

    setFormUpdateCurrentBill((prevState) => {
      const newCustomerNo =
        action === "increment"
          ? prevState.customerNo + 1
          : Math.max(1, prevState.customerNo - 1); // Đảm bảo không giảm xuống dưới 1

      return { ...prevState, customerNo: newCustomerNo };
    });

    timeoutRef.current = setTimeout(() => {
      handleSubmitUpdateCurrentBill();
    }, 2000); // Gọi sau 2 giây
  };

  const handleSubmitUpdateCurrentBill = () => {
    const dataMutate = {
      currentBillId: data?.currentBill?.id,
      customerId: formUpdateCurrentBill.customerId,
      customerNo: formUpdateCurrentBill.customerNo,
    };
    mutate(dataMutate);
  };

  const calculateTotalBill = (currentBill) => {
    if (!currentBill || !currentBill.currentBillItems) {
      return {
        subtotal: 0,
        discount: 0,
        tax: 0,
        voucher: 0,
        total: 0,
      };
    }

    const {
      currentBillItems,
      discountValue,
      discountPercent,
      taxValue,
      taxPercent,
      voucherValue,
      voucherPercent,
    } = currentBill;

    let itemsDiscount = 0;

    const subtotal = currentBillItems.reduce((total, item) => {
      // const productPrice = item.variant.price * item.quantity;

      // const openSelectsTotal = item.openSelects.reduce(
      //   (acc, group) => acc + group.selection.price * group.quantity,
      //   0
      // );

      // const basePrice = productPrice + openSelectsTotal;

      const basePrice = item.finalPrice;

      const itemDiscount = item.voucherPercent
        ? (item.voucherPercent / 100) * basePrice
        : item.voucherValue || 0;

      itemsDiscount += itemDiscount;

      return total + basePrice;
    }, 0);

    const discount =
      itemsDiscount +
      (discountValue ??
        (discountPercent ? (subtotal * discountPercent) / 100 : 0));

    const tax =
      taxValue ?? (taxPercent ? ((subtotal - discount) * taxPercent) / 100 : 0);

    const voucher =
      voucherValue ??
      (voucherPercent ? ((subtotal - discount) * voucherPercent) / 100 : 0);

    const total = subtotal - discount + tax - voucher;

    return { subtotal, discount, tax, voucher, total };
  };

  const totalBill = calculateTotalBill(data?.currentBill);

  const components = [
    <Choosing
      key="Choosing"
      data={data}
      productChoosing={productChoosing}
      setProductChoosing={setProductChoosing}
      setSelectTab={setSelectTab}
      handleSubmitUpdateCurrentBill={handleSubmitUpdateCurrentBill}
      refetch={refetch}
    />,
    <Used
      key="used"
      data={data}
      setOpenListPosition={setOpenListPosition}
      setTypePosition={setTypePosition}
      productSplitChecked={productSplitChecked}
      setProductSplitChecked={setProductSplitChecked}
      handleOpenSplit={handleOpenSplit}
      totalBill={totalBill}
      openBill={() => setOpenBill(true)}
      refetch={refetch}
      setTransferItem={setTransferItem}
      setOpenTransferItem={setOpenTransferItem}
      bankAccounts={accountData?.data ?? []}
    />,
  ];

  return (
    <>
      <div
        ref={divRef}
        className={`bg-white flex flex-col border-l h-full w-full transition-transform duration-300 transform  ${open && (open ? "translate-x-0" : "-translate-x-full")
          }`}
      >
        <div className="px-5 pb-5 bg-[#FFF4F0]">
          <div className="flex flex-col justify-between py-3  border-b border-dashed">
            <div className="flex  gap-3  ">
              <div className="flex flex-wrap gap-3 items-center">
                <CustomButton
                  type="blue-text"
                  className="texl-lg  px-0"
                  suffixIcon={<Image src={ArrowRight} />}
                >
                  {data?.position?.name}
                </CustomButton>
                <p className=" border-x px-5 text-sm">
                  Hoá đơn{" "}
                  <span className="text-[#3355FF] text-sm font-bold">
                    {data?.currentBill?.code}
                  </span>
                </p>
              </div>
              <div className="flex gap-3 items-center">
                {/* <div>Số khách</div> */}
                <div className="relative text-center">
                  <div
                    className={`flex z-50 absolute top-[50%] left-[5%] translate-y-[-50%] justify-center items-center text-xl rounded-full border-[1px] w-[20px] h-[20px] ${formUpdateCurrentBill.customerNo < 2
                      ? "border-[#B2B2B2] text-[#B2B2B2] cursor-not-allowed"
                      : "border-[#E50000] text-[#E50000] cursor-pointer"
                      }`}
                    onClick={() =>
                      formUpdateCurrentBill.customerNo > 1 &&
                      handleCustomerNoChange("decrement")
                    }
                  >
                    -
                  </div>
                  <CustomInput
                    value={formUpdateCurrentBill.customerNo}
                    onChange={(e) =>
                      setFormUpdateCurrentBill({
                        ...formUpdateCurrentBill,
                        customerNo: e,
                      })
                    }
                    className="w-[100px] text-center"
                  />
                  <div
                    className={`flex z-50 absolute top-[50%] right-[5%] translate-y-[-50%] justify-center items-center text-xl rounded-full border-[1px] w-[20px] h-[20px] border-[#3355FF] text-[#3355FF] cursor-pointer`}
                    onClick={() => handleCustomerNoChange("increment")}
                  >
                    +
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[#666666] italic mt-3">
              {formatTimeCreateAtPOS(data?.currentBill?.startDate)} - Tạo bởi{" "}
              {data?.currentBill?.employeeName}
            </p>
          </div>

          <CustomSelect
            onChange={(value) => {
              setFormUpdateCurrentBill({
                ...formUpdateCurrentBill,
                customerId: value,
              });

              handleSubmitUpdateCurrentBill();
            }}
            value={formUpdateCurrentBill.customerId}
            options={customers?.data?.content?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            className="suffix-icon h-11 !rounded-full mt-4"
            placeholder={
              data?.currentBill?.customerId ? "Chọn khách" : "Khách lẻ"
            }
            suffixIcon={
              <>
                <div
                  className="flex items-center gap-1 bg-[#F2F2F2] p-2 rounded-xl text-black"
                  onClick={() => {
                    setOpenModalCustomer(true);
                    setEditCustomer(false);
                  }}
                >
                  <Image src={PlusCircleIcon} alt="" />
                  Thêm
                </div>
                {data?.currentBill?.customerId && (
                  <div
                    className="flex items-center gap-1 bg-[#F2F2F2] p-2 rounded-xl text-black"
                    onClick={() => {
                      setOpenModalCustomer(true);
                      setEditCustomer(true);
                    }}
                  >
                    <Image src={EyePos} alt="" />
                    Xem thông tin
                  </div>
                )}
              </>
            }
          />
        </div>

        <div
          className="flex-1 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 260px)" }}
        >
          <CustomTab
            menu={tabs}
            components={components}
            selectTab={selectTab}
            setSelectTab={setSelectTab}
          />
        </div>
      </div>

      {openModalCustomer && (
        <ModalCustomer
          isOpen={openModalCustomer}
          onCancel={() => setOpenModalCustomer(false)}
          formUpdateCurrentBill={formUpdateCurrentBill}
          setFormUpdateCurrentBill={setFormUpdateCurrentBill}
          edit={editCustomer}
        />
      )}

      {openBill && (
        <Bill
          open={openBill}
          onClose={() => setOpenBill(false)}
          data={data}
          totalBill={totalBill}
          bankAccounts={accountData?.data ?? []}
        />
      )}
    </>
  );
});

export default ActionMenu;
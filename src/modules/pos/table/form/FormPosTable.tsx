import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Phone from "@/assets/Phone.svg";
import MouseCircle from "@/assets/mouse-circle.svg";
import Banking from "@/assets/banking.svg";
import SortingIcon from "@/assets/column-sorting.svg";
import CurrencyCircleDollar from "@/assets/CurrencyCircleDollar.svg";
import { DishPosIcon } from "@/shared/icons/DishPosIcon";
import User from "@/assets/User.svg";
import Note from "@/assets/Note.svg";
import Plus from "@/assets/Plus.svg";
import Minus from "@/assets/Minus.svg";
import Image from "next/image";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomButton } from "@/components/CustomButton";

export default function FormPosTable() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="p-10 mx-[50px]">
      <p className="text-3xl font-semibold">
        {router.query.id === "add" ? t("createTable") : router.query.id}
      </p>
      <CustomCardItem className="mt-4 p-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-5">
            <div>
              <Label label="Thời gian đặt" />
              <CustomDatePicker
                onChange={() => {}}
                bordered={true}
                picker="date"
                format="DD/MM/YYYY HH:mm"
                showTime={{ format: "HH:mm" }}
              />
            </div>

            <div>
              <Label label="Số điện thoại" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                prefixIcon={<Image src={Phone} />}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <Label label="Chọn bàn" />
              <CustomSelect
                onChange={(value) => console.log(value)}
                options={[{ value: 1, label: "Bàn 1" }]}
                showSearch={true}
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn bàn"
                prefixIcon={
                  <div className="flex items-center">
                    <Image src={MouseCircle} alt="" />
                  </div>
                }
              />
            </div>

            <div>
              <Label label="Đặt cọc trước" />
              <div className="grid grid-cols-2">
                <CustomSelect
                  onChange={(value) => console.log(value)}
                  options={[{ value: 1, label: "Chuyển khoản" }]}
                  showSearch={true}
                  className="suffix-icon h-11 !rounded-r-none"
                  placeholder="Chọn phương thức"
                  prefixIcon={
                    <div className="flex items-center translate-y-[-5px] ">
                      <Image src={Banking} alt="" />
                    </div>
                  }
                  suffixIcon={
                    <div className="flex items-center">
                      <Image src={SortingIcon} alt="" />
                    </div>
                  }
                />
                <CustomInput
                  onChange={(value: any) => console.log(value)}
                  prefixIcon={<Image src={CurrencyCircleDollar} />}
                  className="suffix-icon h-11 !rounded-l-none"
                  placeholder="Nhập số tiền"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label label="Số khách" />
                <div>
                  <CustomInput
                    onChange={(value: any) => console.log(value)}
                    suffixIcon={
                      <div className="p-1 w-[20px] h-[20px] rounded-md bg-[#F9FAFB] flex items-center justify-center border">
                        <Image width={16} height={16} src={Minus} />
                      </div>
                    }
                    prefixIcon={
                      <div className="p-1 w-[20px] h-[20px] rounded-md bg-[#F9FAFB] flex items-center justify-center border">
                        <Image width={16} height={16} src={Plus} />
                      </div>
                    }
                    className="h-11  input-center"
                    placeholder="Nhập số tiền"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <Label label="Thời gian dự kiến hoàn tất" />
                <div>
                  <CustomInput
                    onChange={(value: any) => console.log(value)}
                    suffixIcon={
                      <div className="bg-[#EFF2F9] h-full flex justify-center items-center p-3">
                        Phút
                      </div>
                    }
                    className="h-11  !py-0 !pr-0"
                    placeholder="Nhập thời gian"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label label="Khách hàng" />
              <div>
                <CustomInput
                  onChange={(value: any) => console.log(value)}
                  className="h-11  "
                  prefixIcon={<Image src={User} />}
                  placeholder="Nhập tên khách hàng"
                />
              </div>
            </div>

            <div>
              <Label label="Đặt món trước" />
              <CustomSelect
                onChange={(value) => console.log(value)}
                options={[{ value: 1, label: "Bàn 1" }]}
                showSearch={true}
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn món"
                prefixIcon={<DishPosIcon className="translate-y-[-3px]" />}
              />
            </div>

            <div>
              <Label label="Ghi chú" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="h-11  "
                prefixIcon={<Image src={Note} />}
                placeholder="Nhập ghi chú"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <CustomButton type="primary">Hoàn tất đặt bàn</CustomButton>
        </div>
      </CustomCardItem>
    </div>
  );
}

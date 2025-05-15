import { CustomButton } from "@/components/CustomButton";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomSwitch } from "@/components/CustomSwitch";
import CustomUpload from "@/components/CustomUpload";
import { Divider } from "antd";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import EditIcon from "@/assets/Pencil.svg";
import DeleIcon from "@/assets/deleteRed.svg";

const BillPrint = () => {
  const router = useRouter();
  return (
    <div className="px-5 my-5">
      <div className="grid grid-cols-10 gap-5">
        <div className="col-span-6">
          <div className="card">
            <Label infoText="" label="Thiết lập thông tin chung" />
            <Divider />
            <div className="flex justify-between gap-[20px] mb-1">
              <div className="flex-1">
                <Label
                  infoText=""
                  label="Số lần in biên lai tối đa"
                  className="font-normal"
                />
                <CustomInput
                  onChange={() => {}}
                  type="text"
                  placeholder="Nhập tên mặt hàng"
                  className="w-[100%] h-[44px] flex-1"
                />
              </div>
              <div className="flex-1">
                <Label
                  infoText=""
                  label="Số lần in hóa đơn thanh toán"
                  className="font-normal"
                />
                <CustomSelect
                  options={[]}
                  showSearch={true}
                  onChange={() => {}}
                  value=""
                  className="suffix-icon h-11 !rounded"
                  placeholder="Chọn loại mặt hàng"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-[10px]">
              <Label
                infoText=""
                label="Cho phép in hóa đơn tạm tính"
                className="font-normal"
              />
              <CustomSwitch />
            </div>

            <div className="flex-1">
              <Label
                infoText=""
                label="Số lần in hóa đơn tạm tính"
                className="font-normal"
              />
              <CustomInput
                onChange={() => {}}
                type="text"
                placeholder=""
                className="w-[100%] h-[44px] flex-1"
              />
            </div>
          </div>

          <div className="card mt-5">
            <Label infoText="" label="Logo nhà hàng" />
            <Divider />
            <div className="grid grid-cols-10 gap-6">
              <div className="col-span-6">
                <CustomCheckbox onChange={() => {}}>
                  <strong className="font-light">
                    Hiển thị logo và thông tin nhà hàng theo bố cục ngang,Thiết
                    lập logo hiển thị trên đầu hóa đơn
                  </strong>
                </CustomCheckbox>
                <CustomButton
                  type="border-color"
                  wrapClassName="w-[100px] mt-3"
                >
                  Chọn ảnh
                </CustomButton>
              </div>
              <div className="col-span-4">
                <CustomUpload type="type-2" value="" onChangeValue={() => {}} />
              </div>
            </div>
          </div>

          <div className="card mt-5">
            <Label infoText="" label="Ảnh cuối hóa đơn" />
            <Divider />
            <div className="grid  grid-cols-10 gap-6">
              <div className="col-span-6">
                <Label
                  infoText=""
                  label="Mô tả (tối đa 90 ký tự)"
                  className="font-normal"
                />
                <CustomInput
                  onChange={() => {}}
                  type="text"
                  placeholder="Nhập mô tả cho ảnh"
                  className="w-[100%] h-[44px] flex-1"
                />
                <CustomRadio
                  options={[{ value: "picture", label: "Tải ảnh" }]}
                  value=""
                  onChange={() => {}}
                  gap={32}
                />
                <p className="my-3">
                  QR code thanh toán, QR code trang bán hàng online ...
                </p>
                <CustomButton
                  type="border-color"
                  wrapClassName="w-[100px] mb-3"
                >
                  Chọn ảnh
                </CustomButton>
                <CustomRadio
                  options={[
                    {
                      value: "picture",
                      label: "Tạo mã QR tài khoản ngân hàng",
                    },
                  ]}
                  value=""
                  onChange={() => {}}
                  gap={32}
                />
                <div className="mb-4">
                  <Label
                    infoText=""
                    label="Ngân hàng"
                    className="font-normal"
                  />
                  <CustomSelect
                    options={[
                      { value: "1", label: "Ngân hàng A" },
                      { value: "2", label: "Ngân hàng B" },
                    ]}
                    showSearch={true}
                    onChange={() => {}}
                    value="1"
                    className="suffix-icon h-11 !rounded"
                    placeholder="Chọn ngân hàng"
                  />
                </div>
                <div>
                  <Label
                    infoText=""
                    label="Số tài khoản"
                    className="font-normal"
                  />
                  <CustomInput
                    onChange={() => {}}
                    type="text"
                    placeholder="Nhập số tài khoản"
                    className="w-[100%] h-[44px] flex-1"
                  />
                </div>
                <CustomButton
                  type="border-color"
                  wrapClassName="w-[100px] mt-3"
                >
                  Tạo mã
                </CustomButton>
              </div>

              <div className="col-span-4">
                <CustomUpload type="type-2" value="" onChangeValue={() => {}} />
              </div>
            </div>
          </div>

          <div className="card mt-5">
            <Label infoText="" label="Thông tin nhà hàng" />
            <Divider />
            <div className="flex items-center justify-between py-[10px]">
              <Label
                infoText=""
                label="Tùy chỉnh địa chỉ in trên hóa đơn"
                className="font-medium"
              />
              <CustomSwitch />
            </div>
            <CustomTextarea placeholder="Nhập mô tả" rows={5} />
            <div className="mt-6">
              <Label
                infoText=""
                label="Thông tin chân trang hóa đơn"
                className="font-medium"
              />
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <Label
                    infoText=""
                    label="Nội dung 1"
                    className="font-normal"
                  />
                  <CustomCheckbox onChange={() => {}}>
                    <strong className="font-light">In đậm chữ</strong>
                  </CustomCheckbox>
                </div>
                <CustomInput
                  onChange={() => {}}
                  type="text"
                  placeholder=""
                  className="w-[100%] h-[44px] flex-1"
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <Label
                    infoText=""
                    label="Nội dung 2"
                    className="font-normal"
                  />
                  <CustomCheckbox onChange={() => {}}>
                    <strong className="font-light">In đậm chữ</strong>
                  </CustomCheckbox>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <CustomInput
                      onChange={() => {}}
                      type="text"
                      placeholder=""
                      className="w-[100%] h-[44px] flex-1"
                    />
                  </div>
                  <div className="cursor-pointer px-5">
                    <Image src={DeleIcon} alt="Delete Icon" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between my-5">
                <Label
                  infoText=""
                  label="In thông tin wifi dưới chân trang hóa đơn"
                  className="font-medium"
                />
                <CustomSwitch />
              </div>

              <div className="flex gap-5 mb-3">
                <div className="flex-1">
                  <Label infoText="" label="Tên WIFI" className="font-normal" />
                  <CustomInput
                    onChange={() => {}}
                    type="text"
                    placeholder="Nhập tên Wifi "
                    className="w-[100%] h-[44px] flex-1"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    infoText=""
                    label="Mật khẩu WIFI"
                    className="font-normal"
                  />
                  <CustomInput
                    onChange={() => {}}
                    type="text"
                    placeholder="Nhập mật khẩu Wifi"
                    className="w-[100%] h-[44px] flex-1"
                  />
                </div>
              </div>
              <CustomCheckbox onChange={() => {}}>
                <strong className="font-light">
                  In thông tin wifi thành 2 dòng riêng biệt
                </strong>
              </CustomCheckbox>
            </div>
          </div>
        </div>
        <div className="card col-span-4">
          <div className="flex justify-between ">
            <Label infoText="" label="Xem trước" />
            <CustomButton
              type="border-color"
              wrapClassName="min-w-[100px]"
              prefixIcon={<Image src={EditIcon} />}
              onClick={() => router.push("/settings/print-setup/detail-bill/2")}
            >
              Sửa mẫu in
            </CustomButton>
          </div>
          <Divider />
          <div>
            <CustomSelect
              options={[
                { value: "1", label: "Hóa đơn bán hàng" },
                { value: "2", label: "Hóa đơn thanh toán" },
              ]}
              showSearch={true}
              onChange={() => {}}
              value="1"
              className="suffix-icon h-11 !rounded mb-5"
              placeholder="Chọn loại hóa đơn"
            />
            <CustomSelect
              options={[
                { value: "1", label: "Khổ giấy 80mm" },
                { value: "2", label: "Khổ giấy 60mm" },
              ]}
              showSearch={true}
              onChange={() => {}}
              value="1"
              className="suffix-icon h-11 !rounded"
              placeholder="Chọn khổ giấy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPrint;

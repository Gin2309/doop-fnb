import { CustomButton } from "@/components/CustomButton";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import Label from "@/components/CustomLabel";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import Title from "@/components/Title";
import { Divider } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import ArrowLeft from "@/assets/ArrowLeft.svg";

const TemDetails = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-between bg-white p-4 shadow-md">
        <p className="text-2xl font-semibold">Thiết lập in</p>
      </div>

      <div className="bg-white mt-5 py-3 px-5 mx-5 rounded-lg flex justify-between items-center">
        <div>
          <div
            className="flex items-center gap-2 py-2 cursor-pointer"
            onClick={() => router.back()}
          >
            <Image src={ArrowLeft} />
            <p>Quay lại mẫu in tem</p>
          </div>
          <p className="text-2xl font-medium">
            Chỉnh sửa thông tin hiển thị mẫu in tem
          </p>
        </div>
        <div className="flex gap-5 items-center">
          <CustomButton
            type="border-color"
            wrapClassName="w-[100px]"
            onClick={() => router.back()}
          >
            Hủy
          </CustomButton>
          <CustomButton type="primary" wrapClassName="w-[100px]">
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-10 bg-[#F2F2F2] mx-5 mt-5 shadow-xl">
        <div className="col-span-5 bg-[#fff] p-5">
          <CustomSelect
            options={[
              { value: "1", label: "Khổ giấy 30mm x 50mm" },
              { value: "2", label: "Khổ giấy 40mm x 30mm" },
            ]}
            showSearch={true}
            onChange={() => {}}
            value="1"
            className="suffix-icon h-11 !rounded mb-5"
            placeholder="Chọn khổ giấy"
          />

          <Divider />
          <div>
            <Label infoText="" label="Thông tin đơn hàng" />
            <div className="flex flex-col gap-3">
              <CustomCheckbox onChange={() => {}}>
                <strong className="font-light">Hiển thị tên nhà hàng</strong>
              </CustomCheckbox>
              <CustomCheckbox onChange={() => {}}>
                <strong className="font-light">
                  Hiển thị loại hình phục vụ, mã đơn hàng
                </strong>
              </CustomCheckbox>
              <CustomCheckbox onChange={() => {}}>
                <strong className="font-light">
                  Hiển thị ngày giờ phục vụ
                </strong>
              </CustomCheckbox>
            </div>
          </div>

          <Divider />
          <div>
            <Label infoText="" label="Thông tin mặt hàng" />
            <div className="flex flex-col gap-5">
              <div>
                <Label
                  infoText=""
                  label="Cỡ chữ mặt hàng, lựa chọn"
                  className="font-normal"
                />
                <CustomRadio
                  options={[
                    { value: "small", label: "Nhỏ" },
                    { value: "medium", label: "Vừa" },
                    { value: "large", label: "Lớn" },
                  ]}
                  value="small"
                  onChange={(e) => {}}
                  gap={32}
                />
              </div>
              <div>
                <Label
                  infoText=""
                  label="Hiện thị lựa chọn"
                  className="font-normal"
                />
                <CustomRadio
                  options={[
                    { value: "small", label: "Tách dòng" },
                    { value: "medium", label: "Gộp dòng" },
                  ]}
                  value="small"
                  onChange={(e) => {}}
                  gap={32}
                />
              </div>
              <div>
                <Label
                  infoText=""
                  label="Hiện thị giá"
                  className="font-normal"
                />
                <CustomRadio
                  options={[
                    { value: "1", label: "Theo tên mặt hàng" },
                    { value: "2", label: "Cuối danh sách lựa chọn" },
                    { value: "3", label: "Không hiện giá" },
                  ]}
                  value="1"
                  onChange={(e) => {}}
                  gap={32}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5"></div>
      </div>
    </div>
  );
};

export default TemDetails;

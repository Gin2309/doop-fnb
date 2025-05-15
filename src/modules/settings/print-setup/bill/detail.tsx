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

const BillDetails = () => {
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
            <p>Quay lại mẫu in hóa đơn</p>
          </div>
          <p className="text-2xl font-medium">
            Chỉnh sửa thông tin hiển thị mẫu in hóa đơn
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
          <div className="flex gap-4">
            <CustomSelect
              options={[
                { value: "1", label: "Hóa đơn tạm tính" },
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
              className="suffix-icon h-11 !rounded mb-5"
              placeholder="Chọn khổ giấy"
            />
          </div>
          <Divider />
          <Label infoText="" label="Thông tin chung" />
          <div className="flex flex-col gap-3">
            <CustomCheckbox onChange={() => {}}>
              <strong className="font-light">Hiển thị logo</strong>
            </CustomCheckbox>
            <Divider />
            <Label infoText="" label="Thông tin đơn hàng" />
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Tên khu vực bàn
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Tên thu ngân
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Tên nhân viên phục vụ
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">Giờ vào</strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Số điện thoại khách hàng
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Địa chỉ khách hàng
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Thông tin thẻ thành viên
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Ghi chú hóa đơn
              </strong>
            </CustomCheckbox>
          </div>
          <Divider />
          <Label infoText="" label="Thông tin mặt hàng" />
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
          <div className="flex flex-col gap-3">
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Khung danh sách mặt hàng
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Khung danh sách mặt hàng
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Số thứ tự mặt hàng
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Ghi chú theo mặt hàng dịch vụ
              </strong>
            </CustomCheckbox>
          </div>

          <div className="mt-6">
            <Label infoText="" label="Mặt hàng tính tiền theo thời gian" />
            <div className="bg-[#FFF7EF] p-5 rounded-md">
              <CustomCheckbox onChange={(e) => {}}>
                <strong className="font-light whitespace-nowrap">
                  Hiện thị thông tin chi tiết
                </strong>
              </CustomCheckbox>

              <div className="ml-5 py-2">
                <CustomRadio
                  options={[
                    {
                      value: "1",
                      label: "Hiển thị đầy đủ thông tin từng khung giờ sử dụng",
                    },
                    {
                      value: "2",
                      label: "Chỉ hiển thị tổng thời gian sử dụng",
                    },
                  ]}
                  direction="vertical"
                  value="1"
                  onChange={(e) => {}}
                  gap={0}
                />
              </div>

              <CustomCheckbox onChange={(e) => {}}>
                <strong className="font-light whitespace-nowrap">
                  Hiển thị đơn giá
                </strong>
              </CustomCheckbox>

              <div className="ml-5 py-2">
                <CustomRadio
                  options={[
                    {
                      value: "1",
                      label: "Hiển thị đơn vị thời gian của đơn giá",
                    },
                  ]}
                  direction="vertical"
                  value="1"
                  onChange={(e) => {}}
                  gap={0}
                />
              </div>

              <CustomCheckbox onChange={(e) => {}}>
                <strong className="font-light whitespace-nowrap">
                  Hiển thị thời gian đến đơn vị giây
                </strong>
              </CustomCheckbox>
            </div>
          </div>

          <div className="mt-6">
            <Label infoText="" label="Mặt hàng tính tiền theo số lượng" />
            <div className="bg-[#FFF7EF] p-5 rounded-md">
              <div className="mb-2">
                <CustomCheckbox onChange={(e) => {}}>
                  <strong className="font-light whitespace-nowrap">
                    Tên giá mặt hàng
                  </strong>
                </CustomCheckbox>
              </div>

              <CustomCheckbox onChange={(e) => {}}>
                <strong className="font-light whitespace-nowrap">
                  Hiển thị đơn giá
                </strong>
              </CustomCheckbox>
              <div className="ml-5 py-2 mb-3">
                <CustomRadio
                  options={[
                    {
                      value: "1",
                      label: "Hiển thị đơn giá cùng tên mặt hàng",
                    },
                    {
                      value: "2",
                      label: "Hiện thị riêng cột đơn giá",
                    },
                  ]}
                  direction="vertical"
                  value="1"
                  onChange={(e) => {}}
                  gap={0}
                />
                <p className="text-[13px] italic text-[#666]">
                  Lưu ý: Khổ giấy 58mm không hỗ trợ tách riêng cột đơn giá
                </p>
              </div>

              <CustomCheckbox onChange={(e) => {}}>
                <strong className="font-light whitespace-nowrap">
                  Hiển thị thông tin nhóm lựa chọn
                </strong>
              </CustomCheckbox>

              <div className="ml-5 py-2 mb-3">
                <CustomRadio
                  options={[
                    {
                      value: "1",
                      label: "Hiển thị tách dòng bộ lựa chọn",
                    },
                    {
                      value: "2",
                      label: "Hiển thị gộp dòng bộ lựa chọn",
                    },
                  ]}
                  direction="vertical"
                  value="1"
                  onChange={(e) => {}}
                  gap={0}
                />
                <p className="text-[13px] italic text-[#666]">
                  Khi gộp dòng bộ lựa chọn thông tin đơn giá và số lượng sẽ
                  không được hiển thị
                </p>
              </div>

              <CustomCheckbox onChange={(e) => {}}>
                <strong className="font-light whitespace-nowrap">
                  Không in mặt hàng được thiết lập giá 0đ
                </strong>
              </CustomCheckbox>
            </div>
          </div>

          <Divider />
          <Label infoText="" label="Thông tin thanh toán" />
          <div className="flex flex-col gap-3">
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Danh sách các khuyến mại
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Chi tiết thuế
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Chi tiết phí
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Thông tin tổng tiền tạm tính
              </strong>
            </CustomCheckbox>
            <CustomCheckbox onChange={(e) => {}}>
              <strong className="font-light whitespace-nowrap">
                Hiển thị ảnh cuối hóa đơn
              </strong>
            </CustomCheckbox>
          </div>
        </div>
        <div className="col-span-5"></div>
      </div>
    </div>
  );
};

export default BillDetails;

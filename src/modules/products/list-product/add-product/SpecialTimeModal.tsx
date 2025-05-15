import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { CustomRadio } from "@/components/CustomRadio";
import { useTranslation } from "react-i18next";

import type { TimePickerProps } from "antd";
import { message, TimePicker } from "antd";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";

const PickerWithType = ({
  onChange,
  className,
  placeholder,
  value,
}: {
  onChange: TimePickerProps["onChange"];
  className?: string;
  placeholder?: string;
  value?: Dayjs | null;
}) => {
  return (
    <TimePicker
      onChange={onChange}
      className={`w-full h-10 ${className}`}
      format="HH:mm"
      placeholder={placeholder}
      value={value}
    />
  );
};

const ModalSpecialTime = ({
  title,
  isOpen,
  onCancel,
  onConfirm,
  editData,
}: {
  title: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (specialHourData: any) => void;
  editData: any;
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      specialTimeName: "",
      price: 0,
    },
  });

  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const daysOfWeek = [
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 },
    { label: "Chủ nhật", value: 8 },
  ];

  useEffect(() => {
    if (editData) {
      reset({
        specialTimeName: editData.name || "",
        price: editData.price?.toString() || "",
      });
      setIsAllDay(editData.isAllDay || false);
      setStartTime(
        editData.startTime ? dayjs(editData.startTime, "HH:mm") : null
      );
      setEndTime(editData.endTime ? dayjs(editData.endTime, "HH:mm") : null);
      const mappedDays = editData.date.map((day: string | number) => {
        return typeof day === "string" ? parseInt(day, 10) : day;
      });

      setSelectedDays(mappedDays);
    }
  }, [editData, reset]);

  const toggleDaySelection = (dayValue: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const handleConfirm = (data: any) => {
    if (selectedDays.length === 0) {
      message.error("Bạn phải chọn ít nhất một ngày trong tuần");
      return;
    }

    if (!isAllDay && (!startTime || !endTime)) {
      message.error(
        "Vui lòng chọn thời gian bắt đầu và kết thúc khi chọn Khung giờ"
      );
      return;
    }

    if (!isAllDay && endTime && startTime && !endTime.isAfter(startTime)) {
      message.error("Giờ kết thúc phải lớn hơn giờ bắt đầu");
      return;
    }

    const specialTimeData = {
      id: editData?.id || null,
      name: data.specialTimeName,
      price: parseFloat(data.price),
      isAllDay,
      startTime: startTime ? dayjs(startTime).format("HH:mm") : null,
      endTime: endTime ? dayjs(endTime).format("HH:mm") : null,
      date: selectedDays,
    };

    onConfirm(specialTimeData);
    reset({
      specialTimeName: "",
      price: 0,
    });
    setIsAllDay(false);
    setStartTime(null);
    setEndTime(null);
    setSelectedDays([]);
    onCancel();
  };

  const handleCancel = () => {
    reset({
      specialTimeName: "",
      price: 0,
    });
    setIsAllDay(false);
    setStartTime(null);
    setEndTime(null);
    setSelectedDays([]);
    onCancel();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={handleCancel}
      title={title}
      width={850}
      customFooter
    >
      <form onSubmit={handleSubmit(handleConfirm)}>
        <div className="py-2">
          <div className="flex justify-between gap-[20px] mb-4">
            <div className="flex-1">
              <Label infoText="" label="Tên" required />
              <Controller
                rules={{
                  required: "Vui lòng nhập tên khung giờ",
                  validate: (value) => {
                    const trimmedValue = value.trim();
                    if (trimmedValue === "") {
                      return "Tên khung giờ không được để trống";
                    }
                    if (trimmedValue.length !== value.length) {
                      return "Tên khung giờ không được chứa khoảng trắng ở đầu và cuối";
                    }
                    return true;
                  },
                }}
                control={control}
                name="specialTimeName"
                render={({ field }) => (
                  <CustomInput
                    type="text"
                    placeholder="Nhập tên khung giờ"
                    value={field.value}
                    className="w-full h-10 flex-1"
                    onChange={field.onChange}
                  />
                )}
              />
              <InputError error={errors.specialTimeName?.message} />
            </div>
            <div className="flex-1">
              <Label infoText="" label="Giá bán" required />
              <Controller
                rules={{
                  required: "Vui lòng nhập giá bán",
                }}
                control={control}
                name="price"
                render={({ field }) => (
                  <CustomInput
                    type="number"
                    placeholder="Nhập giá bán"
                    value={field.value}
                    className="w-full h-10 flex-1"
                    onChange={field.onChange}
                  />
                )}
              />
              <InputError error={errors.price?.message} />
            </div>
          </div>

          <CustomRadio
            options={[
              { value: "1", label: "Cả ngày" },
              { value: "2", label: "Khung giờ" },
            ]}
            value={isAllDay ? "1" : "2"}
            onChange={(value) => setIsAllDay(value === "1")}
            gap={32}
          />

          {!isAllDay && (
            <div className="flex justify-between gap-[20px] mt-4">
              <div className="flex-1">
                <Label infoText="" label="Từ" />
                <PickerWithType
                  onChange={(time) => setStartTime(time)}
                  className="border-[1px] rounded-md border-gray-300 bg-[#f4f3f3]"
                  placeholder="Chọn"
                  value={startTime}
                />
              </div>
              <div className="flex-1">
                <Label infoText="" label="Đến" />
                <PickerWithType
                  onChange={(time) => setEndTime(time)}
                  className="border-[1px] rounded-md border-gray-300 bg-[#f4f3f3]"
                  placeholder="Chọn"
                  value={endTime}
                />
              </div>
            </div>
          )}

          <div className="my-3 flex justify-between space-x-2">
            {daysOfWeek.map(({ label, value }) => (
              <div
                key={value}
                className={`border-[1px] px-4 py-2 rounded-md border-gray-300 flex-1 text-center cursor-pointer ${
                  selectedDays.includes(value) ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => toggleDaySelection(value)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end w-full gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            outline={true}
            className="!h-11 !w-[120px]"
            type="original"
            onClick={handleCancel}
          >
            {t("cancel")}
          </CustomButton>
          <button
            type="submit"
            className="border-[1px] px-[30px] rounded-[50px] text-[#fff] bg-[#fc6808] cursor-pointer "
          >
            Xác nhận
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ModalSpecialTime;

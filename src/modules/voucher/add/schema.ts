import dayjs from "dayjs";
import * as yup from "yup";

export const schemaVoucher = yup.object().shape({
  branchId: yup.string(),
  name: yup
    .string()
    .test(
      "no-leading-trailing-space",
      "Tên khuyến mại không được có khoảng trắng ở đầu và cuối",
      (value) => (value ? value.trim() === value : true)
    )
    .test(
      "no-special-characters",
      "Tên khuyến mại không được chứa ký tự đặc biệt",
      (value) =>
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơẮẰẴẶẲẲểềễếềễềếệểễềếệêêềêữêềêẹêềêêềêừêềêữÊàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ0-9\s]*$/.test(
          value || ""
        )
    )
    .required("Tên khuyến mại là bắt buộc")
    .max(255, "Tên khuyến mại không được quá 255 ký tự"),

  type: yup.string(),
  discountValue: yup.number().nullable(),
  minBillValue: yup.number().nullable(),
  maxDiscount: yup.number().nullable(),
  isAutoApply: yup.boolean(),
  startDay: yup
    .string()
    .nullable()
    .test(
      "isValidDateRange",
      "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
      function (value) {
        const { endDay } = this.parent;
        return !value || !endDay || new Date(value) < new Date(endDay);
      }
    ),
  endDay: yup
    .string()
    .nullable()
    .test(
      "isValidDateRange",
      "Ngày kết thúc phải lớn hơn ngày bắt đầu",
      function (value) {
        const { startDay } = this.parent;
        return !value || !startDay || new Date(value) >= new Date(startDay);
      }
    ),
  isHaveTimeSlot: yup.boolean(),

  timeSlot: yup.array().of(
    yup.object().shape({
      startTime: yup.string().nullable(),
      // .required("Thời gian bắt đầu là bắt buộc")
      // .test("isValidStartTime", "Thời gian bắt đầu không hợp lệ", (value) =>
      //   dayjs(value, "HH:mm").isValid()
      // ),
      endTime: yup.string().nullable(),
      // .required("Thời gian kết thúc là bắt buộc")
      // .test("isValidEndTime", "Thời gian kết thúc không hợp lệ", (value) =>
      //   dayjs(value, "HH:mm").isValid()
      // ),
    })
  ),

  isDayOfWeek: yup.boolean(),
  dayOfWeek: yup.array().nullable(),
  applyType: yup.string(),
  categories: yup.array(),
  freeItems: yup.array(),
  variants: yup.array().of(
    yup.object().shape({
      variantId: yup.number(),
      quantity: yup.number(),
    })
  ),
  isNoApplySelection: yup.boolean(),
  maxQuantityGift: yup.number().nullable(),
  isAllCustomer: yup.boolean(),
  groupCustomer: yup.array(),
  isOnlineChannel: yup.boolean(),
  menu: yup.array(),
  isApplyItem: yup.boolean(),
});

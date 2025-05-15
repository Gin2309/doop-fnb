import * as yup from "yup";

export const schemaProduct = yup.object().shape({
  name: yup
    .string()
    .test(
      "no-leading-trailing-space",
      "Tên mặt hàng không được có khoảng trắng ở đầu và cuối",
      (value) => (value ? value.trim() === value : true)
    )
    .required("Tên mặt hàng là bắt buộc")
    .max(255, "Tên khuyến mại không được quá 255 ký tự"), // Tên mặt hàng
  type: yup.string().required("Loại mặt hàng là bắt buộc"), // Loại mặt hàng

  // Mảng các mặt hàng con
  variants: yup.array().of(
    yup.object().shape({
      code: yup.string(), // Mã mặt hàng con
      barCode: yup.string(), // Mã vạch
      name: yup.string(), // Tên mặt hàng con
      price: yup.string(), // Giá mặt hàng con
      primePrice: yup.string(), // Giá vốn mặt hàng con
      isConfigPrice: yup.boolean(), // Nhập giá khi bán không
      isBase: yup.boolean(), // Có phải đơn vị cơ bản không
      duration: yup.number().nullable(), // Thời gian sử dụng
      durationType: yup.string().nullable(), // Loại thời gian
    })
  ),

  unitId: yup.string().when("type", {
    is: (value) => value !== "TIME",
    then: (schema) => schema.required("Đơn vị là bắt buộc khi loại mặt hàng là TIME"),
    otherwise: (schema) => schema.nullable(),
  }), // Mã đơn vị
  isPrint: yup.boolean().required(), // Có in tem mặt hàng không
  isManageCode: yup.boolean().required(), // Có quản lý mã không
  isWarehouseLink: yup.boolean().required(), // Có liên kết với kho hàng không
  isSelectionGroup: yup.boolean().required(), // Có nhóm lựa chọn không
  selectionGroupIds: yup.array(), // Mảng id của nhóm lựa chọn

  description: yup.string().nullable(), // Mô tả
  avatarUrl: yup.string().nullable(), // Ảnh
  categoryId: yup.string(), // Id của danh mục
  branchId: yup.string(), // Id của chi nhánh
  menuIds: yup.array(),
  barId: yup.number().nullable(),

  isFirstHour: yup.boolean(),
  isSpecialHour: yup.boolean(),
  variantHourFirst: yup.object().shape({
    duration: yup.number().nullable(),
    durationType: yup.string().nullable(),
    price: yup.number().nullable(),
  }),
  variantHourSpecials: yup.array().of(
    yup.object().shape({
      name: yup.string(), // Tên giờ đặc biệt
      price: yup.string(), // Giá bán
      isAllDay: yup.boolean(), // Áp dụng cả ngày không
      startTime: yup.string().nullable(), // Thời gian bắt đầu
      endTime: yup.string().nullable(), // Thời gian kết thúc
      date: yup.array(), // Chuỗi các thứ trong tuần
    })
  ),
});

import * as yup from "yup";

export const schemaSelectionGroup = yup.object().shape({
  name: yup.string().required("Tên nhóm lựa chọn là bắt buộc"),
  minSelect: yup
    .number()
    .min(0, "Số lượng lựa chọn tối thiểu phải lớn hơn hoặc bằng 0")
    .required("Chọn tối thiểu là bắt buộc"),
  maxSelect: yup.number().nullable(),
  isMultiSelect: yup.boolean(),
  isWarehouseLink: yup.boolean(),
  branchId: yup.number(),
  productIds: yup.array(),
  selections: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Tên lựa chọn là bắt buộc"),
        price: yup
          .number()
          .min(0, "Giá phải lớn hơn hoặc bằng 0")
          .required("Giá là bắt buộc"),
        primePrice: yup
          .number()
          .min(0, "Giá gốc phải lớn hơn hoặc bằng 0")
          .required("Giá gốc là bắt buộc"),
        isDefault: yup.boolean(),
      })
    )
    .min(1, "Phải có ít nhất một lựa chọn"),
});

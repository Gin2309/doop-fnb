import * as yup from "yup";

export const schemaArea = yup.object().shape({
  branchId: yup.number(),
  name: yup
    .string()
    .test(
      "no-leading-trailing-space",
      "Tên khu vực không được có khoảng trắng ở đầu và cuối",
      (value) => (value ? value.trim() === value : true)
    )
    .required("Tên khu vực là bắt buộc")
    .max(10, "Tên khu vực không được quá 10 ký tự"),
  seenOption: yup.string(),
});

export const schemaPosition = yup.object().shape({
  branchId: yup.number(),
  name: yup
    .string()
    .test(
      "no-leading-trailing-space",
      "Tên vị trí không được có khoảng trắng ở đầu và cuối",
      (value) => (value ? value.trim() === value : true)
    )
    .required("Tên vị trí là bắt buộc")
    .max(10, "Tên vị trí không được quá 10 ký tự"),
  areaId: yup.number(),
  orderNo: yup
    .number()
    .typeError("Số thứ tự phải là một số")
    .required("Số thứ tự là bắt buộc"),
  positionType: yup.string().required("Loại/phòng bàn là bắt buộc"),
  noteActive: yup.boolean(),
  lightActive: yup.boolean(),
  robotActive: yup.boolean(),
  staffNameActive: yup.boolean(),
  startTimeActive: yup.boolean(),
  paidActive: yup.boolean(),
  customerNameActive: yup.boolean(),
  defaultServices: yup.array().of(
    yup.object().shape({
      id: yup.number(),
      variantId: yup.number(),
      quantity: yup.number(),
      delete: yup.boolean(),
    })
  ),
});

export const schemaProductVariant = yup.object().shape({
  branchId: yup.number(),
  positionId: yup.number(),
  itemsRequests: yup.array().of(
    yup.object().shape({
      variantId: yup.number(),
      quantity: yup.number(),
    })
  ),
});

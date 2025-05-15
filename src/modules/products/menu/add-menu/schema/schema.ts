import * as yup from "yup";

export const schemaCreateMenu = yup.object().shape({
  name: yup.string().required("Tên thực đơn là bắt buộc"),
  avatarUrl: yup.string().nullable(),
  productIds: yup.array(),
});

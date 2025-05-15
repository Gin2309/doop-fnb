import * as yup from "yup";

export const schemaCreateCategory = yup.object().shape({
  name: yup
    .string()
    .required("Tên danh mục là bắt buộc")
    .max(255, "Tên danh mục không được vượt quá 255 ký tự"),
});

export const schemaUpdateCategory = yup.object().shape({
  name: yup
    .string()
    .required("Tên danh mục là bắt buộc")
    .max(255, "Tên danh mục không được vượt quá 255 ký tự"),
  avatarUrl: yup.string().nullable(),
  productIds: yup.array(),
});

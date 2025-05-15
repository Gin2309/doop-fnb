import * as Yup from "yup";

const schema = Yup.object().shape({
  branchId: Yup.number().optional(),
  menus: Yup.array().nullable(),
  categoryId: Yup.array().nullable(),
  name: Yup.string()
    .required("Tên combo là bắt buộc")
    .min(1, "Tên combo không được để trống"),
  code: Yup.string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  price: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("isFixPrice", {
      is: false,
      then: (schema) =>
        schema
          .required("Giá bán là bắt buộc")
          .positive("Giá bán phải là số dương"),
      otherwise: (schema) => schema.notRequired(),
    }),
  isFixPrice: Yup.boolean().optional(),
  variants: Yup.array()
    .of(
      Yup.object().shape({
        variantId: Yup.number().optional(),
        quantity: Yup.number()
          .optional()
          .positive("Số lượng phải là số dương")
          .integer("Số lượng phải là số nguyên"),
      })
    )
    .optional(),
  avatarUrl: Yup.string().optional(),
  barId: Yup.number().nullable(),
});

export default schema;

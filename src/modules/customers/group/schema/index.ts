import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Tên nhóm khách hàng là bắt buộc")
    .max(100, "Tên nhóm khách hàng không được dài quá 50 ký tự"),
  isBranchChainLink: Yup.boolean().nullable(),
  description: Yup.string()
    .nullable()
    .max(1000, "Ghi chú không được dài quá 1000 ký tự"),
  foodDiscount: Yup.number()
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  hourDiscount: Yup.number()
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  otherDiscount: Yup.number()
    .transform((value) => (value === "" ? null : value))
    .nullable(),
});

export default schema;

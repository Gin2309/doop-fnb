import * as Yup from "yup";

const schema = Yup.object().shape({
  vatTaxCode: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .matches(/^\d+$/, "Mã số thuế phải là chữ số")
    .max(50, "Mã số thuế không được dài quá 50 ký tự")
    .nullable()
    .when("isVatBill", {
      is: true,
      then: (schema) => schema.required("Mã số thuế là bắt buộc"),
    }),
  vatCompany: Yup.string()
    .nullable()
    .when("isVatBill", {
      is: true,
      then: (schema) => schema.required("Tên công ty là bắt buộc"),
    }),
  vatAddress: Yup.string()
    .nullable()
    .when("isVatBill", {
      is: true,
      then: (schema) => schema.required("Địa chỉ là bắt buộc"),
    }),
  vatEmail: Yup.string()
    .email("Email không hợp lệ")
    .nullable()
    .when("isVatBill", {
      is: true,
      then: (schema) => schema.required("Email là bắt buộc"),
    }),
  vatPhone: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .matches(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
      "Số điện thoại không đúng định dạng"
    )
    .nullable(),
  vatNote: Yup.string().nullable(),
  vatName: Yup.string()
    .max(100, "Tên người mua không được dài quá 100 ký tự")
    .nullable(),
});

export default schema;

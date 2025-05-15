import * as Yup from "yup";

const schema = Yup.object().shape({
  code: Yup.string().optional(),
  name: Yup.string()
    .required("Họ và tên khách hàng là bắt buộc")
    .max(100, "Họ và tên không được dài quá 100 ký tự"),
  email: Yup.string().email("Email không hợp lệ").nullable(),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^[0-9]+$/, "Số điện thoại không đúng định dạng"),
  dob: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .max(new Date(), "Ngày sinh không hợp lệ"),
  gender: Yup.string().nullable(),
  provinceCode: Yup.string().nullable(),
  districtCode: Yup.string().nullable(),
  address: Yup.string()
    .nullable()
    .max(200, "Địa chỉ không được dài quá 200 ký tự"),
  note: Yup.string()
    .nullable()
    .max(500, "Ghi chú không được dài quá 500 ký tự"),
  isVatBill: Yup.boolean().nullable(),
  isAutoVatBill: Yup.boolean().nullable(),
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

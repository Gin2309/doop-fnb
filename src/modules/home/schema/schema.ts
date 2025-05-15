import * as yup from "yup";

export const schema = yup.object({
  name: yup.string().required("Tên chi nhánh là bắt buộc"),
  branchChainId: yup.number(),
  phone: yup
    .string()
    .required("Đây là trường bắt buộc!")
    .matches(/^[0-9]+$/, "Số điện thoại phải là số và không chứa khoảng trắng")
    .matches(/^0/, "Số điện thoại phải bắt đầu bằng 0")
    .length(10, "Số điện thoại phải có đúng 10 chữ số")
    .test(
      "no-whitespace",
      "Số điện thoại không được có khoảng trắng",
      (value) => value === value?.trim()
    ),
  address: yup.string().required("Địa chỉ là bắt buộc"),
  email: yup
    .string()
    .optional()
    .email("Email không hợp lệ")
    .test("is-valid-email", "Email không hợp lệ", (value) => {
      if (!value) return true; // Không kiểm tra nếu rỗng
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value); // Kiểm tra regex nếu có giá trị
    }),
  isAuto: yup.boolean(),
  manager: yup.string(),
  taxUnitName: yup.string().when("isAuto", {
    is: true,
    then: (schema) => schema.required("Tên đơn vị thuế là bắt buộc"),
    otherwise: (schema) => schema.optional(),
  }),
  taxAddress: yup.string().when("isAuto", {
    is: true,
    then: (schema) => schema.required("Địa chỉ thuế là bắt buộc"),
    otherwise: (schema) => schema.optional(),
  }),
  taxEmail: yup.string().when("isAuto", {
    is: true,
    then: (schema) =>
      schema
        .required("Email thuế là bắt buộc")
        .email("Email không hợp lệ")
        .matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Email không hợp lệ"),
    otherwise: (schema) => schema.optional(),
  }),
  taxCode: yup.string().when("isAuto", {
    is: true,
    then: (schema) =>
      schema
        .required("Mã số thuế là bắt buộc")
        .test(
          "no-whitespace",
          "Mã số thuế không được có khoảng trắng",
          (value) => value === value?.trim()
        ),
    otherwise: (schema) => schema.optional(),
  }),
  description: yup.string(),
  avatarUrl: yup.string(),
  businessModel: yup.string(),
});

export const schemaBranchChain = yup.object().shape({
  name: yup.string().required("Tên chuỗi chi nhánh là bắt buộc"),
  slogan: yup.string(),
  logo: yup.string(),
  businessModel: yup.string(),
});

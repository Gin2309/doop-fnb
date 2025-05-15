import * as yup from "yup";

export const schema = yup.object().shape({
  phone: yup
    .string()
    .required("Đây là trường bắt buộc!")
    .matches(/^[0-9]+$/, "Số điện thoại phải là số và không chứa khoảng trắng")
    .matches(/^0/, "Số điện thoại phải bắt đầu bằng 0")
    .length(10, "Số điện thoại phải có đúng 10 chữ số")
    .test(
      "no-whitespace",
      "Số điện thoại không được có khoảng trắng",
      (value) => {
        return value === value?.trim();
      }
    ),
  password: yup
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(32, "Mật khẩu tối đa 32 ký tự")
    .required("Đây là trường bắt buộc!")
    .matches(/^[^\s]+$/, "Mật khẩu không được chứa khoảng trắng")
    .test("no-whitespace", "Mật khẩu không được chứa khoảng trắng", (value) => {
      return value === value?.trim();
    }),
  role: yup
    .string()
    .oneOf(["FNB", "CRM"], "Role phải là FNB hoặc CRM")
    .required("Đây là trường bắt buộc!"),
});

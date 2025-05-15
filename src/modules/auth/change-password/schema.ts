import * as yup from "yup";

export const schema = yup.object().shape({
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "Số điện thoại phải là số và không chứa khoảng trắng")
    .required("Đây là trường bắt buộc!"),

  password: yup
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(32, "Mật khẩu tối đa 32 ký tự")
    .required("Đây là trường bắt buộc!")
    .matches(/^[^\s]+$/, "Mật khẩu không được chứa khoảng trắng")
    .test("no-whitespace", "Mật khẩu không được chứa khoảng trắng", (value) => {
      return value === value?.trim();
    }),

  confirmPassword: yup
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(32, "Mật khẩu tối đa 32 ký tự")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc")
    .matches(/^[^\s]+$/, "Mật khẩu không được chứa khoảng trắng")
    .test("no-whitespace", "Mật khẩu không được chứa khoảng trắng", (value) => {
      return value === value?.trim();
    }),
});

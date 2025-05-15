import * as yup from "yup";
import dayjs from "dayjs";

export const schema = yup.object().shape({
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "Số điện thoại phải là số và không chứa khoảng trắng")
    .required("Đây là trường bắt buộc!"),

  interestService: yup.array().of(yup.string()),

  name: yup
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được dài quá 50 ký tự")
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

  email: yup.string().email("Địa chỉ email không hợp lệ"),

  address: yup.string().max(100, "Địa chỉ không được dài quá 100 ký tự"),

  sex: yup.string(),
  // .oneOf(["MALE", "FEMALE"], "Giới tính phải là 'Nam',hoặc 'Nữ'"),

  // dob: yup
  //   .string()
  //   .required("Ngày sinh là bắt buộc")
  //   .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải có định dạng YYYY-MM-DD")
  //   .test("dob", "Ngày sinh không được vượt quá ngày hiện tại", (value) =>
  //     dayjs(value).isBefore(dayjs(), "day")
  //   ),

  dob: yup
    .string()
    .nullable()
    .notRequired()
    // .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải có định dạng YYYY-MM-DD")
    .test(
      "dob",
      "Ngày sinh không được vượt quá ngày hiện tại",
      (value) => !value || dayjs(value).isBefore(dayjs(), "day")
    ),

  identityCardFront: yup.string(),

  identityCardBack: yup.string(),
});

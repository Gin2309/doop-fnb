import * as Yup from "yup";

const schema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(32, "Mật khẩu không được vượt quá 32 ký tự")
    .matches(/^\S*$/, "Mật khẩu không được chứa khoảng trắng")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu nhập lại không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

export default schema;

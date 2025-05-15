import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Họ và tên là bắt buộc")
    .max(50, "Họ và tên không được quá 50 ký tự"),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^[0-9]+$/, "Số điện thoại không đúng định dạng"),
  email: Yup.string().email("Email không hợp lệ"),
  sex: Yup.string().nullable(),
  address: Yup.string().nullable(),
  id: Yup.string().nullable(),
  avatar: Yup.string().nullable(),
  identityCardFront: Yup.string().nullable(),
  identityCardBack: Yup.string().nullable(),
  interestService: Yup.mixed().nullable(),
});

export default schema;

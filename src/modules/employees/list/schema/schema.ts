import * as yup from "yup";

export const schemaAddEmployee = yup.object().shape({
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
  employeeRoleId: yup.string().required("Vai trò là bắt buộc"),
  note: yup.string(),
});

export const schemaUpdateEmployee = yup.object().shape({
  employeeRoleId: yup.string().required("Vai trò là bắt buộc"),
  status: yup.string().required("Trạng thái là bắt buộc"),
  name: yup.string(),
});

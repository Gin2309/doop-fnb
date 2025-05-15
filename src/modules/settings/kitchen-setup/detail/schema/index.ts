import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Tên bếp là bắt buộc")
    .max(100, "Tên bếp  không được dài quá 50 ký tự"),
  prodductIds: Yup.array().optional(),
  isDefault: Yup.boolean().optional(),
});

export default schema;

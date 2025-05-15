import * as yup from "yup";

export const schemaCreateUnit = yup.object().shape({
  name: yup.string().required("Tên đơn vị là bắt buộc"),
});

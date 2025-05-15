import * as yup from "yup";

export const schema = yup.object().shape({
  packageId: yup.string().required("Package ID is required"),
  packageName: yup.string(),
});

export const paymentSchema = yup.object().shape({
  recipientAccountNumber: yup.string(),
  recipientName: yup.string(),
  bankName: yup.string(),
  transferAmount: yup.number(),
  description: yup.string(),
  branchId: yup.number(),
  packageId: yup.number(),
  packageName: yup.string(),
  paymentMethod: yup.string(),
  billCode: yup.string(),
  note: yup.string(),
});

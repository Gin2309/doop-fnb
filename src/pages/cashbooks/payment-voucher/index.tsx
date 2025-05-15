import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import PaymentVoucher from "@/modules/cashbooks/payment-voucher";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Phiếu chi" />}
    >
      <PaymentVoucher />
    </Layout>
  );
};

export default Index;

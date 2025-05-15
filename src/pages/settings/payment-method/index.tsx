import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import PaymentSetup from "@/modules/settings/payment-method";

const ReportSetup = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Setting" />}>
      <PaymentSetup />
    </Layout>
  );
};

export default ReportSetup;

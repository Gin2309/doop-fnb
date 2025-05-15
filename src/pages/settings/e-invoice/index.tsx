import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Invoice from "@/modules/settings/invoice-setup";

const ReportSetup = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Setting" />}>
      <Invoice />
    </Layout>
  );
};

export default ReportSetup;

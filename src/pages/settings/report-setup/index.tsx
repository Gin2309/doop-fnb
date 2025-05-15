import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Report from "@/modules/settings/report-setup";

const ReportSetup = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Setting" />}>
      <Report />
    </Layout>
  );
};

export default ReportSetup;

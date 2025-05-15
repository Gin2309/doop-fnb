import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import SaleSetup from "@/modules/settings/sales-setup";

const Index = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Setting" />}>
      <SaleSetup />
    </Layout>
  );
};

export default Index;

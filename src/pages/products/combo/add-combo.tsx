import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddCombo from "@/modules/products/combo/add";

const Index = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Combo" />}>
      <AddCombo />
    </Layout>
  );
};

export default Index;

import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import DetailCombo from "@/modules/products/combo/detail";

const Index = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Combo" />}>
      <DetailCombo />
    </Layout>
  );
};

export default Index;

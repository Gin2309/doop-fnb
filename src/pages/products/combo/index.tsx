import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Combo from "@/modules/products/combo";

const Index = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Combo" />}>
      <Combo />
    </Layout>
  );
};

export default Index;

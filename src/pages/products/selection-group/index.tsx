import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ProductSelectionGroup from "@/modules/products/selection-group";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Mặt hàng" />}
      noMargin
    >
      <ProductSelectionGroup />
    </Layout>
  );
};

export default Index;

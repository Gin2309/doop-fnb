import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ProductMenu from "@/modules/products/menu";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Mặt hàng" />}
      noMargin
    >
      <ProductMenu />
    </Layout>
  );
};

export default Index;

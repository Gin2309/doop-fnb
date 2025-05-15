import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ProductCategories from "@/modules/products/categories";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Mặt hàng" />}
      noMargin
    >
      <ProductCategories />
    </Layout>
  );
};

export default Index;

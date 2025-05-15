import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ProductList from "@/modules/products/list-product";

const Index = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Mặt hàng" />}>
      <ProductList /> 
    </Layout>
  );
};

export default Index;

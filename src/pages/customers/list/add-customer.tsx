import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddCustomer from "@/modules/customers/list/add";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Thêm khách hàng" />}
    >
      <AddCustomer />
    </Layout>
  );
};

export default Index;

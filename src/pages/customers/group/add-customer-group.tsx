import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddCustomerGroup from "@/modules/customers/group/add";

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Doop - Web dashboard" description="Thêm nhóm khách hàng" />
      }
    >
      <AddCustomerGroup />
    </Layout>
  );
};

export default Index;

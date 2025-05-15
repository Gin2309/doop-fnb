import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import DetailCustomerGroup from "@/modules/customers/group/detail";

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Doop - Web dashboard"
          description="Chi tiết nhóm khách hàng"
        />
      }
    >
      <DetailCustomerGroup />
    </Layout>
  );
};

export default Index;

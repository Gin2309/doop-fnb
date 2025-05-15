import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";

import DetailCustomer from "@/modules/customers/list/detail";

const CustomerDetail = () => {
  return (
    <>
      <Layout
        meta={
          <Meta title="Doop - Web dashboard" description="Thêm khách hàng" />
        }
      >
        <DetailCustomer />
      </Layout>
    </>
  );
};

export default CustomerDetail;

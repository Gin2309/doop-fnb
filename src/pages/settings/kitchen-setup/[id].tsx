import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";

import DetailKitchen from "@/modules/settings/kitchen-setup/detail";

const Detail = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      >
        <DetailKitchen />
      </Layout>
    </>
  );
};

export default Detail;

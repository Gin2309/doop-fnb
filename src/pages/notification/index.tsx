import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Notification from "@/modules/notification";

const index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Thông báo" />}
    >
      <Notification />
    </Layout>
  );
};

export default index;

import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import PrintSetup from "@/modules/settings/print-setup";

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Doop - Web dashboard"
          description="Quản lý vai trò và phân quyền"
        />
      }
      noMargin
    >
      <PrintSetup />
    </Layout>
  );
};

export default Index;

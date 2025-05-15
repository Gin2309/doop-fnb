import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Room from "@/modules/settings/room-table-setup";

const Index = () => {
  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Setting" />}>
      <Room />
    </Layout>
  );
};

export default Index;

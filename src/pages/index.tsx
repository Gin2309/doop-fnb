import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import { Home } from "@/modules/home";
import Title from "@/components/Title";
import Banner from "@/modules/home/Banner";

import useSyncLogoutAcrossTabs from "@/hooks/useSyncLogoutAcrossTabs";

const Index = () => {
  useSyncLogoutAcrossTabs();
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Tổng quan" />}
    >
      <Banner />
      <div className="mt-5">
        <Title>dashboard</Title>
      </div>
      <Home />
    </Layout>
  );
};

export default Index;

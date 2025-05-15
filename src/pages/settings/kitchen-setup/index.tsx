import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Kitchen from "@/modules/settings/kitchen-setup";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      noMargin
    >
      <Kitchen />
    </Layout>
  );
};

export default Index;

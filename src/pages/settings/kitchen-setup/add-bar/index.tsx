import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddKitchen from "@/modules/settings/kitchen-setup/add";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      noMargin
    >
      <AddKitchen />
    </Layout>
  );
};

export default Index;

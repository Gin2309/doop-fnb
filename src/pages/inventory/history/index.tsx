import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import History from "@/modules/inventory/history";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Kho hàng" />}
      >
        <History />
      </Layout>
    </>
  );
};

export default Index;

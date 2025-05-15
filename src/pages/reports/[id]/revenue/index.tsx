import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Revenue from "@/modules/report/revenue";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Báo cáo" />}
      >
        <Revenue />
      </Layout>
    </>
  );
};

export default Index;

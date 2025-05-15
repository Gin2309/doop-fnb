import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Finance from "@/modules/report/sale";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Báo cáo" />}
      >
        <Finance />
      </Layout>
    </>
  );
};

export default Index;

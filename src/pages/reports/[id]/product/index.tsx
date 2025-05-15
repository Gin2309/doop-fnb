import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Products from "@/modules/report/product";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Báo cáo" />}
      >
        <Products />
      </Layout>
    </>
  );
};

export default Index;

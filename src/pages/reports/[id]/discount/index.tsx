import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import DiscountRePort from "@/modules/report/discount";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Báo cáo" />}
      >
        <DiscountRePort />
      </Layout>
    </>
  );
};

export default Index;

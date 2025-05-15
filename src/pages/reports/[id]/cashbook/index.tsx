import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import CashBookRePort from "@/modules/report/cashbook";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Báo cáo" />}
      >
        <CashBookRePort />
      </Layout>
    </>
  );
};

export default Index;

import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import StockIn from "@/modules/inventory/stock-in";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Kho hàng" />}
      >
        <StockIn />
      </Layout>
    </>
  );
};

export default Index;

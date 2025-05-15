import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import StockCheck from "@/modules/inventory/stock-check";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Kho hàng" />}
      >
        <StockCheck />
      </Layout>
    </>
  );
};

export default Index;

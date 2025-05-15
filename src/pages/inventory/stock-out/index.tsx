import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import StockOut from "@/modules/inventory/stock-out";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Kho hàng" />}
      >
        <StockOut />
      </Layout>
    </>
  );
};

export default Index;

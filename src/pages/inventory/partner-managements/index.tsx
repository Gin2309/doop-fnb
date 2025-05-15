import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Partner from "@/modules/inventory/partner";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Kho hàng" />}
      >
        <Partner />
      </Layout>
    </>
  );
};

export default Index;

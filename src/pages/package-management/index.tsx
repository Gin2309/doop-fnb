import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Package from "@/modules/package-management";

const Index = () => {
  return (
    <>
      <Layout
        meta={
          <Meta title="Doop - Web dashboard" description="Quản lý gói mua" />
        }
      >
        <Package />
      </Layout>
    </>
  );
};

export default Index;

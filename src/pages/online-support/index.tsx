import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Support from "@/modules/online-support";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Hỗ trợ`" />}
      >
        <Support />
      </Layout>
    </>
  );
};

export default Index;

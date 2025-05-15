import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Account from "@/modules/account-setup";

const Index = () => {
  return (
    <>
      <Layout
        meta={
          <Meta
            title="Doop - Web dashboard"
            description="Thiết lập tài khoản"
          />
        }
      >
        <Account />
      </Layout>
    </>
  );
};

export default Index;

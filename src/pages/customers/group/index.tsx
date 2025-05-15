import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import CustomerGroup from "@/modules/customers/group";

const Customers = () => {
  return (
    <>
      <Layout
        meta={
          <Meta title="Doop - Web dashboard" description="Nhóm khách hàng" />
        }
      >
        <CustomerGroup />
      </Layout>
    </>
  );
};

export default Customers;

import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import CustomerList from "@/modules/customers/list";

const Customers = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Khách hàng" />}
      >
        <CustomerList />
      </Layout>
    </>
  );
};

export default Customers;

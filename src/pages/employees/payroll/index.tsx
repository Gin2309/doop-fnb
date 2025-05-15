import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Payroll from "@/modules/employees/payroll";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Nhân viên" />}
      >
        <Payroll />
      </Layout>
    </>
  );
};

export default Index;

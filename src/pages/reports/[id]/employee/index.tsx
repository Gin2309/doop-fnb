import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import EmployeeRePort from "@/modules/report/employee";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Báo cáo" />}
      >
        <EmployeeRePort />
      </Layout>
    </>
  );
};

export default Index;

import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import EmployeeRole from "@/modules/employees/role";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Nhân viên" />}
      >
        <EmployeeRole />
      </Layout>
    </>
  );
};

export default Index;

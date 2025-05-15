import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import EmployeeList from "@/modules/employees/list";

const Index = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Nhân viên" />}
      >
        <EmployeeList />
      </Layout>
    </>
  );
};

export default Index;

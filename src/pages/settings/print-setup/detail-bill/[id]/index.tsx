import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import BillDetails from "@/modules/settings/print-setup/bill/detail";

const DeviceSetupPage = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Mẫu in hóa đơn" />}
      noMargin
    >
      <BillDetails />
    </Layout>
  );
};

export default DeviceSetupPage;

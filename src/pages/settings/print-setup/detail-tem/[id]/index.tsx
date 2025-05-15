import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import BillDetails from "@/modules/settings/print-setup/bill/detail";
import TemDetails from "@/modules/settings/print-setup/tem/detail";

const DeviceSetupPage = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      noMargin
    >
      <TemDetails />
    </Layout>
  );
};

export default DeviceSetupPage;

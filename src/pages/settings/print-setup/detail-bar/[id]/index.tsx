import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import BillDetails from "@/modules/settings/print-setup/bill/detail";
import BarDetails from "@/modules/settings/print-setup/bar/detail";

const DeviceSetupPage = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Mẫu in bếp" />}
      noMargin
    >
      <BarDetails />
    </Layout>
  );
};

export default DeviceSetupPage;

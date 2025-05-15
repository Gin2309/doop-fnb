import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import BillDetails from "@/modules/settings/print-setup/bill/detail";
import InventoryDetails from "@/modules/settings/print-setup/inventory/detail";

const DeviceSetupPage = () => {
  return (
    <Layout
      meta={
        <Meta title="Doop - Web dashboard" description="Mẫu in phiếu kiểm đồ" />
      }
      noMargin
    >
      <InventoryDetails />
    </Layout>
  );
};

export default DeviceSetupPage;

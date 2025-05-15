import React from "react";
import Device from "@/modules/settings/device-setup/page";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";

const DeviceSetupPage = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      noMargin
    >
      <Device />
    </Layout>
  );
};

export default DeviceSetupPage;

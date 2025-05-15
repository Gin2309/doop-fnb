import React from "react";
import AddDevice from "@/modules/settings/device-setup/Add";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";

const DeviceSetupPage = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      noMargin
    >
      <AddDevice />
    </Layout>
  );
};

export default DeviceSetupPage;

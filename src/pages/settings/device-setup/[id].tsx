import React from "react";
import Detail from "@/modules/settings/device-setup/Detail";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";

const DeviceSetupPage = () => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      noMargin
    >
      <Detail />
    </Layout>
  );
};

export default DeviceSetupPage;

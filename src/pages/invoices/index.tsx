import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import { useTranslation } from "react-i18next";

import Title from "@/components/Title";
import AllInvoices from "@/modules/invoices/Tab1";

const Invoices = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Hóa đơn" />}
      >
        <Title>invoices</Title>

        <div className="mb-6">
          <AllInvoices />
        </div>
      </Layout>
    </>
  );
};

export default Invoices;

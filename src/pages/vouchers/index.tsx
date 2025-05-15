import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Voucher from "@/modules/voucher";

const Vouchers = () => {
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Thẻ giảm giá" />}
      >
        <Voucher />
      </Layout>
    </>
  );
};

export default Vouchers;

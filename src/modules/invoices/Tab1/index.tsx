import React, { useState } from "react";

import Table from "../CustomTable";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

import { useQuery } from "@tanstack/react-query";
import { getBill } from "@/api/bill-pos.service";

const AllInvoices = (props: any) => {
  const branch = useRecoilValue(branchStateSession);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    sort: "createdAt",
    order: "DESC",
    branchId: branch.id,
  });

  const { data, isLoading } = useQuery(["INVOICE", formFilter], () =>
    getBill(formFilter)
  );

  return (
    <>
      <div className="card">
        <Table
          data={data?.data?.content}
          isLoading={isLoading}
          formFilter={formFilter}
          setFormFilter={setFormFilter}
        />
      </div>
    </>
  );
};

export default AllInvoices;

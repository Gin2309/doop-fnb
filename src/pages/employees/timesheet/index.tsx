import React from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Timesheet from "@/modules/employees/timesheet";
import { useRecoilState } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getDetailBranch } from "@/api/branch.service";

const Index = () => {
  const [branch, setBranch] = useRecoilState(branchStateSession);
  const router = useRouter();

  const { data: detailBranch } = useQuery({
    queryKey: ["DETAIL_BRANCH"],
    queryFn: () => getDetailBranch(Number(router.query.id)),
    refetchOnWindowFocus: false,
    enabled: Boolean(router.query.id),
    onSuccess: async (data) => {
      setBranch(data?.data);
    },
  });
  return (
    <>
      <Layout
        meta={<Meta title="Doop - Web dashboard" description="Nhân viên" />}
      >
        <Timesheet />
      </Layout>
    </>
  );
};

export default Index;

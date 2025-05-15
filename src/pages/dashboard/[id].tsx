import { getDetailBranch } from "@/api/branch.service";
import Title from "@/components/Title";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import { DetailDashboard } from "@/modules/home/detail-dashboard";
import { branchStateSession } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

export default function Detail() {
  const router = useRouter();
  const [branch, setBranch] = useRecoilState(branchStateSession);

  const { data: detailBranch } = useQuery({
    queryKey: ["DETAIL_BRANCH"],
    queryFn: () => getDetailBranch(Number(router.query.id)),
    refetchOnWindowFocus: false,
    enabled: Boolean(router.query.id && router.query.id !== "add"),
    onSuccess: (data) => {
      setBranch(data?.data);
    },
  });

  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Tổng quan" />}
    >
      <Title>{branch?.name || "Chi nhánh"}</Title>
      <DetailDashboard id={Number(router.query.id)} />
    </Layout>
  );
}

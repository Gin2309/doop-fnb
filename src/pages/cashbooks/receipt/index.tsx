import { getDetailBranch } from "@/api/branch.service";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Receipt from "@/modules/cashbooks/receipt";
import { branchStateSession } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

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
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Phiếu thu" />}
    >
      <Receipt />
    </Layout>
  );
};

export default Index;

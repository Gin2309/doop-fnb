import { getDetailBranch } from "@/api/branch.service";
import KdsLayout from "@/layouts/KdsLayout";
import { Meta } from "@/layouts/Meta";
import KdsContent from "@/modules/kds";
// import KdsContent from "@/modules/kds";
import { branchStateSession } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

export default function KdsPage() {
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
    <KdsLayout meta={<Meta title="Doop - Web dashboard" description="Pos" />}>
      <KdsContent />
    </KdsLayout>
  );
}

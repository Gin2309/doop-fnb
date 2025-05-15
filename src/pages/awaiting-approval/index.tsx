import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AwaitingApprovalPage from "@/modules/awaiting-approval";

export default function AwaitingApproval() {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Chờ phê duyệt" />}
    >
      <AwaitingApprovalPage />
    </Layout>
  );
}

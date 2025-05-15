import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import { ProfitLoss } from "@/modules/cashbooks/profit-loss-accounting";

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Doop - Web dashboard" description="Hoạch toán lãi lỗ" />
      }
    >
      <ProfitLoss />
    </Layout>
  );
};

export default Index;

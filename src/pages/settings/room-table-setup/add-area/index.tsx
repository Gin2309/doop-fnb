import { useTranslation } from "react-i18next";
import { formatBoolean } from "@/helpers";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddArea from "@/modules/settings/room-table-setup/add-area";

export const getServerSideProps = (context) => {
  const { id, copy } = context.query;

  return { props: { id: id || null, copy: formatBoolean(copy) } };
};

const Index = ({ id, copy }: { id?: string; copy?: boolean }) => {
  const { t } = useTranslation();

  return (
    <Layout meta={<Meta title="Doop - Web dashboard" description="Setting" />}>
      <AddArea id={id} />
    </Layout>
  );
};

export default Index;

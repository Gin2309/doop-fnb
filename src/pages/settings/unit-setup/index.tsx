import { useTranslation } from "react-i18next";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Unit from "@/modules/settings/unit-setup/index";

const Index = () => {
  const { t } = useTranslation();

  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Setting" />}
      noMargin
    >
      <Unit />
    </Layout>
  );
};

export default Index;

import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Link from "next/link";
import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import DetailRole from "@/modules/employees/role/DetailRole";
import { useTranslation } from "react-i18next";

export default function DetailRolePage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Nhân viên" />}
      noMargin
    >
      <DetailRole mode={router.query.id} />
    </Layout>
  );
}

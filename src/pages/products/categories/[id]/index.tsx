import Image from "next/image";
import Link from "next/link";

import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import { formatBoolean } from "@/helpers";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddProduct from "@/modules/products/list-product/add-product";
import DetailCategory from "@/modules/products/categories/DetailCategory";
import { useRouter } from "next/router";

const DetailCategoryPage = () => {
  return <DetailCategory />;
};

export default DetailCategoryPage;

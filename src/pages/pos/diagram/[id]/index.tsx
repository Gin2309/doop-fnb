import { getDetailMenu, getMenu } from "@/api/menu.service";
import { Meta } from "@/layouts/Meta";
import PostLayout from "@/layouts/PosLayout";
import ActionMenu, { ActionMenuRef } from "@/modules/pos/invoice/form/ActionMenu";
import MenuDish from "@/modules/pos/invoice/form/MenuDish";
import { branchStateSession } from "@/recoil/state";
import List from "@/assets/List.svg";
import { useQuery } from "@tanstack/react-query";
import { Drawer, message, TabsProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { getProductByMenu } from "@/api/product.service";
import Image from "next/image";
import CustomTabPos from "@/modules/pos/invoice/components/CustomTabPos";
import { useRouter } from "next/router";
import { getDetailPosPosition } from "@/api/area-pos.service";
import ListPosition from "@/modules/pos/diagram/components/ListPosition";
import { EPositionAction } from "@/enums";
import { ROUTER_DIAGRAM_POS } from "@/layouts/PosLayout/Header";

export default function DetailInvoicePage() {
  const branch = useRecoilValue(branchStateSession);
  const [selectIdMenu, setSelectIdMenu] = useState();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [productChoosing, setProductChoosing] = useState<any[]>([]);
  const [openListPosition, setOpenListPosition] = useState(false);
  const [typePosition, setTypePosition] = useState<any>(null);
  const [productSplitChecked, setProductSplitChecked] = useState<any>([]);
  const [openListPosition2, setOpenListPosition2] = useState(false);
  const [transferItem, setTransferItem] = useState<any>(null);
  const actionMenuRef = useRef<ActionMenuRef | null>(null);

  useEffect(() => {
    // Không có dữ liệu branch ở phiên hiện tại, cook về trang chủ
    if (!branch?.id) { router.replace("/");}
  }, [branch?.id]);

  const [formFilter, setFormFilter] = useState({
    limit: 999,
    page: 1,
    branchId: branch?.id,
    keyword: "",
  });

  const [formFilterProduct, setFormFilterProduct] = useState({
    branchId: branch?.id,
    categoryId: "",
    keyword: "",
    type: "",
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleUpdateProductChoosing = (products: any[]) => {
    setProductChoosing(products);
    if (actionMenuRef.current) actionMenuRef.current.setSelectTab(0)
  }

  const { data: menus } = useQuery(
    ["MENU", formFilter],
    () => getMenu(formFilter),
    {
      onSuccess(response: any) {
        if (response?.data?.length > 0) {
          setSelectIdMenu(response?.data[0]?.id);
        }
      },
    }
  );

  const { data: listProductByMenu } = useQuery(
    ["MENU", selectIdMenu, branch?.id, formFilterProduct],
    () => getProductByMenu(Number(selectIdMenu), formFilterProduct),
    { enabled: !!selectIdMenu && !!branch.id }
  );

  const { data: detailPosition, refetch } = useQuery(
    ["DETAIL_POSITION", router.query.id, branch?.id],
    () => getDetailPosPosition(Number(router.query.id), branch.id),
    { 
      enabled: !!router.query.id && !!branch?.id && !(openListPosition || openListPosition2), 
      refetchInterval: 3000
    }
  );

  const items: TabsProps["items"] = menus?.data?.map((item) => ({
    key: item?.id,
    label: item?.name,
    avatar: item?.avatarUrl,
  }));

  const handleOpenSplit = () => {
    if (productSplitChecked?.length > 0) {
      setOpenListPosition(true);
      setTypePosition(EPositionAction.SPLIT);
    } else {
      message.error("Vui lòng thêm sản phẩm để tách!");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => { 
    /** huỷ hoá đơn thành công */
    if (detailPosition?.data?.positionStatus === "BLANK" && !detailPosition?.data?.currentBill) {
      router.push(ROUTER_DIAGRAM_POS);
    }
  }, [detailPosition?.data?.positionStatus, detailPosition?.data?.currentBill])

  return (
    <>
      <PostLayout
        meta={<Meta title="Doop - Web dashboard" description="Pos" />}
      >
        <div className="h-full">
          <div className="flex h-full">
            <div className="w-[100px] lg:w-[124px] border-r border-[#FFE6CC] p-2">
              <CustomTabPos menu={items} setSelectIdMenu={setSelectIdMenu} />
            </div>

            <div className="flex w-full bg-[#F8F9FD]">
              <div className="w-full">
                <MenuDish
                  data={listProductByMenu?.data}
                  formFilterProduct={formFilterProduct}
                  setFormFilterProduct={setFormFilterProduct}
                  productChoosing={productChoosing}
                  setProductChoosing={handleUpdateProductChoosing}
                />
              </div>
              <div className="w-[450px] hidden lg:flex flex-shrink-0">
                <ActionMenu
                  data={detailPosition?.data}
                  productChoosing={productChoosing}
                  setProductChoosing={setProductChoosing}
                  setOpenListPosition={setOpenListPosition}
                  setTypePosition={setTypePosition}
                  productSplitChecked={productSplitChecked}
                  setProductSplitChecked={setProductSplitChecked}
                  handleOpenSplit={handleOpenSplit}
                  refetch={refetch}
                  setTransferItem={setTransferItem}
                  setOpenTransferItem={setOpenListPosition2}
                  ref={actionMenuRef}
                />
              </div>
            </div>
          </div>

          <div className="fixed lg:hidden top-[20%] right-[1%] ">
            <div
              className="flex justify-center items-center p-2 rounded-lg bg-[#FF5C00] cursor-pointer"
              onClick={showDrawer}
            >
              <Image width={24} height={24} src={List} />
            </div>
          </div>
        </div>
      </PostLayout>

      <Drawer width={450} onClose={onClose} open={open} placement="right">
        <ActionMenu
          open={true}
          data={detailPosition?.data}
          productChoosing={productChoosing}
          setProductChoosing={setProductChoosing}
          setOpenListPosition={setOpenListPosition}
          setTypePosition={setTypePosition}
          productSplitChecked={productSplitChecked}
          setProductSplitChecked={setProductSplitChecked}
          handleOpenSplit={handleOpenSplit}
          refetch={refetch}
          setTransferItem={setTransferItem}
          setOpenTransferItem={setOpenListPosition2}
        />
      </Drawer>

      {openListPosition && (
        <ListPosition
          setOpenListPosition={setOpenListPosition}
          seenOption={"EXTEND"}
          currentPosition={router.query.id}
          type={typePosition}
          productSplitChecked={productSplitChecked}
          setTransferItem={setTransferItem}
          setOpenTransferItem={setOpenListPosition2}
          currentBill={detailPosition?.data?.currentBill}
        />
      )}

      {openListPosition2 && (
        <ListPosition
          setOpenListPosition={setOpenListPosition2}
          seenOption={"EXTEND"}
          type={"TRANSFER_ITEMS"}
          transferData={transferItem}
          setTransferItem={setTransferItem}
          setOpenTransferItem={setOpenListPosition2}
          currentBill={detailPosition?.data?.currentBill}
        />
      )}
    </>
  );
}

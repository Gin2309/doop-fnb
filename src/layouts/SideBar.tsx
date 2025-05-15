import type { MenuProps } from "antd";
import { Menu } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import ForkKnife from "@/assets/ForkKnife.svg";
import Home from "@/assets/House.svg";
import ListPlus from "@/assets/ListPlus.svg";
import Users from "@/assets/Users.svg";
import User from "@/assets/User.svg";
import Gear from "@/assets/Gear.svg";
import Wallet from "@/assets/SmallWallet.svg";
import UserCircleGear from "@/assets/UserCircleGear.svg";
import SignOut from "@/assets/SignOut.svg";

import Noti from "@/assets/noti.svg";
import Message from "@/assets/Message.svg";
import Money from "@/assets/CurrencyCircleDollar.svg";
import Package from "@/assets/Package.svg";
import Voucher from "@/assets/voucher.svg";
import KdsIcon from "@/assets/kds.svg";
import PosSidebar from "@/assets/pos2.svg";
import Invoice from "@/assets/Invoice.svg";
import Report from "@/assets/Report.svg";
import { hasMultiplePermission, hasPermission } from "@/helpers";
import { RoleKey } from "@/modules/settings/role/role.enum";
import Logo from "@/public/logo.png";
import {
  profileState,
  searchState,
  notificationState,
  branchStateSession,
} from "@/recoil/state";

import { SideBarStyled } from "./styled";
import { setToken } from "@/helpers/storage";
import { StoreFront } from "@/shared/icons/StoreFront";
import { useQuery } from "@tanstack/react-query";
import { getBranch, getDetailBranch } from "@/api/branch.service";
import { EStatusBranch } from "@/enums";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: any,
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const productGroup = {
  PRODUCT_LIST: "/products/list",
  PRODUCT_MENU: "/products/menu",
  PRODUCT_CATEGORIES: "/products/categories",
  PRODUCT_SELECTION_GROUP: "/products/selection-group",
  PRODUCT_COMBO: "/products/combo",
};

export const employeeGroup = {
  EMPLOYEE_LIST: "/employees/list",
  EMPLOYEE_ROLE: "/employees/role",
  EMPLOYEE_TIMESHEET: "/employees/timesheet",
  EMPLOYEE_PAYROLL: "/employees/payroll",
};

export const customerGroup = {
  CUSTOMER_LIST: "/customers/list",
  CUSTOMER_GROUP: "/customers/group",
  MEMBERSHIP_CARD: "/customers/membership-card",
  // VOUCHER: "/customers/vouchers",
};

const reportsGroup = {
  REPORT_REVENUE: "/revenue",
  REPORT_PRODUCT: "/product",
  REPORT_INVENTORY: "/inventory",
  REPORT_SALE: "/sale",
  REPORT_DISCOUNT: "/discount",
  REPORT_EMPLOYEE: "/employee",
  REPORT_CASHBOOK: "/cashbook",
};

export const inventoryGroup = {
  STOCK_INVENTORY: "/inventory/inventory-stock",
  STOCK_IN: "/inventory/stock-in",
  STOCK_OUT: "/inventory/stock-out",
  STOCK_CHECK: "/inventory/stock-check",
  INVENTORY_HISTORY: "/inventory/history",
  PARTNER_MANAGEMENTS: "/inventory/partner-managements",
};

export const cashBookGroup = {
  RECEIPT: "/cashbooks/receipt",
  PAYMENT_VOUCHER: "/cashbooks/payment-voucher",
  PROFIT_LOSS_ACCOUNTING: "/cashbooks/profit-loss-accounting",
};

const settingGroup = {
  SETTING_STORE: "/settings/store",
  SETTING_BRANCH: "/settings/branch",
  SETTING_ADD_BRANCH: "/settings/branch/add-branch",
  SETTING_EMPLOYEE: "/settings/employee",
  SETTING_ADD_EMPLOYEE: "/settings/employee/add-employee",
  SETTING_ROLE: "/settings/role",
  SETTING_ADD_ROLE: "/settings/employee/add-role",
  SETTING_DISCOUNT: "/settings/discount",
  SETTING_ADD_DISCOUNT: "/settings/discount/add-discount",
  SETTING_COLLECT_POINT: "/settings/collect-point",
  SETTING_CONNECT_SYSTEM: "/settings/connect-system",
  SETTING_DELIVERY: "/settings/delivery-fee",
  SETTING_DELIVERY_FEE: "/settings/delivery-fee/setting-fee",
  SETTING_CONNECT_DELIVERY: "/settings/connect-delivery",
};

const keyMenu = {
  HOME: "/",

  AWAITING_APPROVAL: "/awaiting-approval",

  NOTIFICATION: "/notification",

  INVOICES: "/invoices",

  REPORTS: "/reports",
  ...reportsGroup,

  PRODUCT: "/products",

  BRANCH: "/branch",

  ...productGroup,

  EMPLOYEE: "/employees",
  ...employeeGroup,

  CUSTOMER: "/customers",
  ...customerGroup,

  // VOUCHER: "/vouchers",
  VOUCHER: "/vouchers",

  POS: "/pos/diagram",

  KDS: "/kds?pending-payment",

  INVENTORY: "/inventory",
  ...inventoryGroup,

  CASHBOOK: "/cashbook",
  ...cashBookGroup,

  SETTING: "/settings",
  ...settingGroup,

  PACKAGE_MANAGEMENT: "/package-management",

  ACCOUNT_SETUP: "/account-setup",

  ONLINE_SUPPORT: "/online-support",

  LOGOUT: "/auth/sign-in",
};

const SideBar = ({ open, pos }: { open?: any; pos?: any }) => {
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  const noti = useRecoilValue(notificationState);
  const [menuActive, setMenuActive] = useState<any>([]);

  const [branch, setBranch] = useRecoilState(branchStateSession);

  const [menu, setMenu] = useState<any>([]);
  const searchQuery = useRecoilValue(searchState);

  const [, setProfileState] = useRecoilState(profileState);
  const [, setNotificationState] = useRecoilState(notificationState);
  const countTotal = noti?.total ?? 0;
  const countAwaiting = noti?.invitation ?? 0;
  const countPackage = noti?.expiration ?? 0;

  const { data: branches } = useQuery(["BRANCH"], () =>
    getBranch({
      limit: 99999,
      page: 1,
    })
  );

  const branchData = branches?.data?.content?.reduce((acc, branch) => {
    // Bỏ qua branch không active
    if (branch.status !== EStatusBranch.ACTIVE) return acc;

    const branchChainId = branch.branchChain?.id || "other";
    const branchChainName = branch.branchChain?.name || "Chưa phân loại";

    // Tìm chain đã tồn tại trong acc theo branchChain.id hoặc 'other'
    let existingChain = acc.find((item) => item.id === branchChainId);

    // Nếu đã có chain, thêm branch vào children, nếu không, tạo mới
    if (existingChain) {
      existingChain.children.push(branch);
    } else {
      acc.push({
        id: branchChainId, // Dùng id từ branch hoặc 'other'
        name: branchChainName, // Tên chain hoặc 'Chưa phân loại'
        children: [branch], // Gán branch vào children
      });
    }

    return acc;
  }, []);

  const items = (permissions: any[]) => {
    if (!branch) {
      return [
        hasPermission(permissions, RoleKey.home) &&
        getItem("dashboard", keyMenu.HOME, <Image src={Home} />),

        hasPermission(permissions, RoleKey.notification) &&
        getItem(
          countTotal > 0
            ? t("notification", { countTotal })
            : "notification2",
          keyMenu.NOTIFICATION,
          <Image src={Noti} height={20} width={20} />
        ),

        hasPermission(permissions, RoleKey.awaiting_approval) &&
        getItem(
          countAwaiting > 0
            ? t("awaitingApproval", { countAwaiting })
            : "awaitingApproval2",
          keyMenu.AWAITING_APPROVAL,
          <Image src={ListPlus} />
        ),

        branchData?.length > 0 && { type: "divider" },

        branchData?.length > 0 &&
        hasMultiplePermission(permissions, []) &&
        getItem(
          "branch",
          keyMenu.BRANCH,
          <StoreFront />,
          branchData?.map((branch) =>
            getItem(
              branch.name,
              `branch-${branch.id}`,
              null,
              branch.children.map((child) =>
                getItem(child.name, `branch-child-${child.id}`, null)
              )
            )
          )
        ),

        branchData?.length > 0 && { type: "divider" },

        hasPermission(permissions, RoleKey.package_management) &&
        getItem(
          countPackage > 0
            ? t("packageManagement", { countPackage })
            : "packageManagement2",
          keyMenu.PACKAGE_MANAGEMENT,
          <Image src={Wallet} />
        ),

        hasPermission(permissions, RoleKey.account_setup) &&
        getItem(
          "accountSetup",
          keyMenu.ACCOUNT_SETUP,
          <Image src={UserCircleGear} />
        ),

        hasPermission(permissions, RoleKey.online_support) &&
        getItem(
          "onlineSupport",
          keyMenu.ONLINE_SUPPORT,
          <Image src={Message} />
        ),

        hasPermission(permissions, RoleKey.logout) &&
        getItem("logout", keyMenu.LOGOUT, <Image src={SignOut} />),
      ];
    } else {
      return [
        hasPermission(permissions, RoleKey.home) &&
        getItem("dashboard", keyMenu.HOME, <Image src={Home} />),

        hasPermission(permissions, RoleKey.notification) &&
        getItem(
          countTotal > 0
            ? t("notification", { countTotal })
            : "notification2",
          keyMenu.NOTIFICATION,
          <Image src={Noti} height={20} width={20} />
        ),

        hasPermission(permissions, RoleKey.awaiting_approval) &&
        getItem(
          countAwaiting > 0
            ? t("awaitingApproval", { countAwaiting })
            : "awaitingApproval2",
          keyMenu.AWAITING_APPROVAL,
          <Image src={ListPlus} />
        ),

        { type: "divider" },

        {
          key: "title",
          label: branch?.name || "branch",
        },

        hasPermission(permissions, RoleKey.pos) &&
        getItem("pos", keyMenu.POS, <Image src={PosSidebar} />),

        hasPermission(permissions, RoleKey.kds) &&
        getItem("kds", keyMenu.KDS, <Image src={KdsIcon} />),

        hasPermission(permissions, RoleKey.invoices) &&
        getItem("invoice", keyMenu.INVOICES, <Image src={Invoice} />),

        // hasPermission(permissions, RoleKey.vouchers) &&
        //   getItem("Thẻ giảm giá", keyMenu.VOUCHER),

        hasPermission(permissions, RoleKey.report_revenue) &&
        getItem("report", keyMenu.REPORTS, <Image src={Report} />, [
          hasPermission(permissions, RoleKey.report_revenue) &&
          getItem(
            "reportRevenue",
            `/reports/${router.query.id}${reportsGroup.REPORT_REVENUE}`
          ),
          hasPermission(permissions, RoleKey.report_product) &&
          getItem(
            "reportProduct",
            `/reports/${router.query.id}${reportsGroup.REPORT_PRODUCT}`
          ),
          hasPermission(permissions, RoleKey.report_inventory) &&
          getItem(
            "inventoryReport",
            `/reports/${router.query.id}${reportsGroup.REPORT_INVENTORY}`
          ),
          hasPermission(permissions, RoleKey.report_sale) &&
          getItem(
            "reportSale",
            `/reports/${router.query.id}${reportsGroup.REPORT_SALE}`
          ),
          hasPermission(permissions, RoleKey.report_discount) &&
          getItem(
            "reportDiscount",
            `/reports/${router.query.id}${reportsGroup.REPORT_DISCOUNT}`
          ),
          hasPermission(permissions, RoleKey.report_employee) &&
          getItem(
            "reportEmployee",
            `/reports/${router.query.id}${reportsGroup.REPORT_EMPLOYEE}`
          ),
          hasPermission(permissions, RoleKey.report_cashbook) &&
          getItem(
            "reportCashbook",
            `/reports/${router.query.id}${reportsGroup.REPORT_CASHBOOK}`
          ),
        ]),

        hasPermission(permissions, RoleKey.list_product) &&
        getItem("products", keyMenu.PRODUCT, <Image src={ForkKnife} />, [
          hasPermission(permissions, RoleKey.list_product) &&
          getItem("productsList", keyMenu.PRODUCT_LIST),
          hasPermission(permissions, RoleKey.list_product) &&
          getItem("menu", keyMenu.PRODUCT_MENU),
          hasPermission(permissions, RoleKey.list_product) &&
          getItem("categories", keyMenu.PRODUCT_CATEGORIES),
          hasPermission(permissions, RoleKey.list_product) &&
          getItem("selection-group", keyMenu.PRODUCT_SELECTION_GROUP),
          hasPermission(permissions, RoleKey.list_product) &&
          getItem("combo", keyMenu.PRODUCT_COMBO),
        ]),

        hasPermission(permissions, RoleKey.list_employees) &&
        getItem("staff", keyMenu.EMPLOYEE, <Image src={Users} />, [
          hasPermission(permissions, RoleKey.list_employees) &&
          getItem("employeeList", keyMenu.EMPLOYEE_LIST),
          hasPermission(permissions, RoleKey.employees_role) &&
          getItem("employeeRole", keyMenu.EMPLOYEE_ROLE),
          hasPermission(permissions, RoleKey.timesheet) &&
          getItem("timesheet", keyMenu.EMPLOYEE_TIMESHEET),
          hasPermission(permissions, RoleKey.payroll) &&
          getItem("payroll", keyMenu.EMPLOYEE_PAYROLL),
        ]),
        hasPermission(permissions, RoleKey.list_customers) &&
        getItem("customer", keyMenu.CUSTOMER, <Image src={User} />, [
          hasPermission(permissions, RoleKey.list_customers) &&
          getItem("customerList", keyMenu.CUSTOMER_LIST),
          hasPermission(permissions, RoleKey.list_customers) &&
          getItem("customerGroup", keyMenu.CUSTOMER_GROUP),

          hasPermission(permissions, RoleKey.membership_card) &&
          getItem("membershipAndPrepaidCard", keyMenu.MEMBERSHIP_CARD),
        ]),

        hasPermission(permissions, RoleKey.vouchers) &&
        getItem("discountCard", keyMenu.VOUCHER, <Image src={Voucher} />),

        hasPermission(permissions, RoleKey.stock_inventory) &&
        getItem("inventory", keyMenu.INVENTORY, <Image src={Package} />, [
          hasPermission(permissions, RoleKey.stock_inventory) &&
          getItem("stock", keyMenu.STOCK_INVENTORY),
          hasPermission(permissions, RoleKey.stock_in) &&
          getItem("stockIn", keyMenu.STOCK_IN),
          hasPermission(permissions, RoleKey.stock_out) &&
          getItem("stockOut", keyMenu.STOCK_OUT),
          hasPermission(permissions, RoleKey.stock_check) &&
          getItem("stockCheck", keyMenu.STOCK_CHECK),
          hasPermission(permissions, RoleKey.history) &&
          getItem("inventoryHistory", keyMenu.INVENTORY_HISTORY),
          hasPermission(permissions, RoleKey.partner_management) &&
          getItem("partnerManagement", keyMenu.PARTNER_MANAGEMENTS),
        ]),

        hasPermission(permissions, RoleKey.receipt) &&
        getItem("cashBook", keyMenu.CASHBOOK, <Image src={Money} />, [
          hasPermission(permissions, RoleKey.receipt) &&
          getItem("receipt", keyMenu.RECEIPT),
          hasPermission(permissions, RoleKey.payment_voucher) &&
          getItem("paymentVoucher", keyMenu.PAYMENT_VOUCHER),
          hasPermission(permissions, RoleKey.profit_loss_accounting) &&
          getItem("profitLossAccounting", keyMenu.PROFIT_LOSS_ACCOUNTING),
        ]),

        hasPermission(permissions, RoleKey.store) &&
        getItem("branchSetup", keyMenu.SETTING, <Image src={Gear} />),

        { type: "divider" },

        hasPermission(permissions, RoleKey.package_management) &&
        getItem(
          countPackage > 0
            ? t("packageManagement", { countPackage })
            : "packageManagement2",
          keyMenu.PACKAGE_MANAGEMENT,
          <Image src={Wallet} />
        ),

        hasPermission(permissions, RoleKey.account_setup) &&
        getItem(
          "accountSetup",
          keyMenu.ACCOUNT_SETUP,
          <Image src={UserCircleGear} />
        ),

        hasPermission(permissions, RoleKey.online_support) &&
        getItem(
          "onlineSupport",
          keyMenu.ONLINE_SUPPORT,
          <Image src={Message} />
        ),

        hasPermission(permissions, RoleKey.logout) &&
        getItem("logout", keyMenu.LOGOUT, <Image src={SignOut} />),
      ];
    }
  };

  useEffect(() => {
    setMenu(items(branch?.employeeDto?.employeeRole?.permissions));
  }, [profile, branches, branch, countTotal, countAwaiting, countPackage]);

  useEffect(() => {
    if (!router.pathname) return;

    const originPath = router.pathname;
    const menuActive: any = [];

    if (originPath === keyMenu.HOME) {
      setMenuActive([keyMenu.HOME]);
      return;
    }

    Object.values(keyMenu).forEach((path: string) => {
      if (originPath.startsWith(path) && path !== keyMenu.HOME) {
        menuActive.push(path);
      }
    });

    setMenuActive(menuActive);
  }, [router.pathname]);

  const { t } = useTranslation();

  const filterMenuItems = (
    items: MenuItem[],
    searchQuery: string
  ): MenuItem[] => {
    return items
      .map((item: any) => {
        const translatedLabel = (label: string) => {
          return t(label);
        };

        if (item?.key === "title") {
          item = {
            ...item,
            disabled: true,
          };
        }

        if (
          item?.label &&
          item?.label.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return {
            ...item,
            label: translatedLabel(item?.label),
            children: item?.children?.map((child) => ({
              ...child,
              label: translatedLabel(child?.label),
            })),
          };
        }

        if (item?.children) {
          const filteredChildren = filterMenuItems(item?.children, searchQuery);

          if (filteredChildren.length > 0) {
            return {
              ...item,
              label: translatedLabel(item?.label),
              children: filteredChildren,
            };
          }
        }

        return item;
      })
      .filter((item) => item !== null);
  };

  const filteredMenu = filterMenuItems(menu, searchQuery);

  const handleBranchNavigation = (key: string) => {
    const branchId = key.split("-").pop();
    if (branchId) {
      window.open(`/dashboard/${branchId}`, "_blank");
    }
  };

  const handleReportNavigation = (key: string) => {
    const branchId = router.query.id;
    if (!branchId) return;

    const reportPath = key.replace("branch-report-", "");
    router.push(`/reports/${branchId}${reportPath}`);
  };

  const activeKey = useMemo(() => {
    let path = router.asPath.split("?")[0] || "/";
    if (path.endsWith("/") && path !== "/") path = path.slice(0, -1);
    return path;
  }, [router.asPath])


  return (
    <SideBarStyled
      className={`transition-transform duration-300 transform  ${!pos && (open ? "translate-x-0" : "-translate-x-full")
        }`}
      style={{
        width: pos ? "100%" : open ? 250 : 0,
        minWidth: pos ? "100%" : open ? 250 : 0,
        transition: "all 0.3s ease",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <div
        className="flex justify-center items-center py-3 px-4 cursor-pointer"
        onClick={() => {
          router.push("/");
          setBranch(null);
        }}
      >
        <Image src={Logo} alt="Logo" />
      </div>
      <Menu
        selectedKeys={[activeKey]}
        openKeys={menuActive}
        mode="inline"
        theme="dark"
        items={filteredMenu}
        onSelect={({ selectedKeys }) => {
          const key = selectedKeys[0] as string;
          if (key.startsWith("branch-report-")) {
            handleReportNavigation(key);
          } else if (
            key.startsWith("branch-") ||
            key.startsWith("branch-child-")
          ) {
            handleBranchNavigation(key);
          } else {
            router.push(key);
          }
          setMenuActive(selectedKeys);
        }}
        onOpenChange={(value) => setMenuActive(value)}
        onClick={({ key }) => {
          if (key.startsWith("branch-report-")) {
            handleReportNavigation(key);
          } else if (
            key.startsWith("branch-") ||
            key.startsWith("branch-child-")
          ) {
            handleBranchNavigation(key);
          } else if (key === "/") {
            setBranch(null);
          } else if (key === "/auth/sign-in") {
            setToken("");
            setBranch(null);
            setProfileState(null);
            setNotificationState(null);
          } else {
            router.push(key);
          }
        }}
      />
    </SideBarStyled>
  );
};

export default SideBar;

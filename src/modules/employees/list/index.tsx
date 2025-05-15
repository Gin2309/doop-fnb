import { useEffect, useState } from "react";
import NoList from "./NoList";
import AddEmployee from "./components/AddEmployee";
import { useQuery } from "@tanstack/react-query";
import { getEmployee } from "@/api/employee.service";
import { useRecoilValue } from "recoil";
import { EStatusEmployee } from "@/enums";
import TableAction from "./TableContent/TableAction";
import { CustomButton } from "@/components/CustomButton";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import Title from "@/components/Title";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import TableList from "./TableContent/TableList";
import CustomPagination from "@/components/CustomPagination";
import { branchStateSession } from "@/recoil/state";

export default function EmployeeList() {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);

  const [formFilter, setFormFilter] = useState({
    limit: 20,
    page: 1,
    branchId: branch?.id,
    status: undefined,
    role: "",
    keyword: "",
  });

  const {
    data: employee,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["EMPLOYEE", formFilter], () => getEmployee(formFilter));

  useEffect(() => {
    if (branch) {
      setFormFilter((prev) => ({
        ...prev,
        branchId: branch?.id,
      }));
    }
  }, [branch]);

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>employeeList</Title>
        {employee?.data?.totalElements > 0 && (
          <CustomButton
            type="primary"
            prefixIcon={<Image src={PlusIcon} />}
            onClick={() => setIsOpenAdd(true)}
          >
            {t("addEmployee")}
          </CustomButton>
        )}
      </div>
      <div className="card mb-6">
        <TableAction formFilter={formFilter} setFormFilter={setFormFilter} />
        <div className="flex gap-2 items-center my-5 ">
          <div className="text-xl font-semibold">
            {branch?.name || "Loading..."}
          </div>
          <div className="w-1 h-1 bg-[#B2B2B2] rounded-full"></div>
          <div className="text-[#3355ff] text-lg font-semibold">
            {employee?.data?.totalElements} {t("employee")}
          </div>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error</div>
        ) : formFilter.keyword !== "" && employee?.data?.totalElements === 0 ? (
          <TableList data={employee?.data?.content} />
        ) : employee?.data?.totalElements > 0 ? (
          <>
            <TableList data={employee?.data?.content} />
            <CustomPagination
              page={formFilter.page}
              pageSize={formFilter.limit}
              setPage={(value) => setFormFilter({ ...formFilter, page: value })}
              setPerPage={(value) =>
                setFormFilter({ ...formFilter, limit: value, page: 1 })
              }
              total={employee?.data?.totalElements}
            />
          </>
        ) : (
          <NoList setIsOpenAdd={setIsOpenAdd} />
        )}
      </div>
      <AddEmployee isOpen={isOpenAdd} onCancel={() => setIsOpenAdd(false)} />
    </>
  );
}

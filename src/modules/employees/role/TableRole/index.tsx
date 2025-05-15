import { getRole } from "@/api/role.service";
import { CustomCardItem } from "@/components/CustomCardItem";
import CustomPagination from "@/components/CustomPagination";
import { branchStateSession } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

export default function TableRole() {
  const router = useRouter();

  const branch = useRecoilValue(branchStateSession);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    branchId: branch?.id,
    keyword: "",
  });

  useEffect(() => {
    if (branch) {
      setFormFilter((prev) => ({
        ...prev,
        branchId: branch?.id,
      }));
    }
  }, [branch]);

  const {
    data: roles,
    isLoading,
    refetch,
  } = useQuery(
    [
      "ROLE",
      formFilter.page,
      formFilter.limit,
      formFilter.branchId,
      formFilter.keyword,
    ],
    () => getRole(formFilter)
  );

  const { t } = useTranslation();
  return (
    <CustomCardItem>
      <div className="p-8 mt-5">
        {isLoading ? (
          <div>Loading</div>
        ) : roles?.data?.numberOfElements > 0 ? (
          <>
            <div className="p-2 bg-[#F9FAFD] border-b border-[#D6DDFF] font-semibold py-3">
              {t("roleDelegation")}
            </div>
            {roles?.data?.content?.map((item, index) => (
              <div
                key={index}
                className="p-2 border-b border-[#E9EDF5] py-3 text-[#3355FF] cursor-pointer"
                onClick={() => router.push(`/employees/role/${item.id}`)}
              >
                {item.name}
              </div>
            ))}
            <div className="p-2">
              <CustomPagination
                page={formFilter.page}
                pageSize={formFilter.limit}
                setPage={(value) =>
                  setFormFilter({ ...formFilter, page: value })
                }
                setPerPage={(value) =>
                  setFormFilter({ ...formFilter, limit: value, page: 1 })
                }
                total={roles?.data?.totalElements}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-2xl font-semibold">Chưa có vai trò nào</p>
            <p className="text-[#66666] mt-2">
              Thêm mới vai trò nhân viên để vận hành nhà hàng thuận tiện hơn.
            </p>
          </div>
        )}
      </div>
    </CustomCardItem>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { getToken } from "@/helpers/storage";
import { orderActiveState, profileState } from "@/recoil/state";
import { getProfile } from "@/api/user.service";

const excludePath = ["/auth/sign-in"];

export function InitGlobalData() {
  const router = useRouter();

  const [, setProfileState] = useRecoilState(profileState);
  // const [branch, setBranch] = useRecoilState(branchState);
  const orderActive = useRecoilValue(orderActiveState);

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery(["PROFILE", getToken(), router.pathname], () => getProfile(), {
    enabled: !!getToken() && !excludePath.includes(router.pathname),
  });

  useEffect(() => {
    if (isLoading) {
      setProfileState((prevState: any) => ({
        ...prevState,
        isLoading: true,
      }));
    } else {
      setProfileState({
        data: profile?.data || null,
        isLoading: false,
        refetch,
      });
    }
  }, [isLoading, profile, setProfileState]);

  return <></>;
}

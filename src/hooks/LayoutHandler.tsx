import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { posRouterState } from "@/recoil/state";

export default function LayoutHandler() {
  const router = useRouter();
  const [, setPosState] = useRecoilState(posRouterState);

  useEffect(() => {
    if (router.pathname.startsWith("/pos")) {
      setPosState(true);
    } else {
      setPosState(false);
    }
  }, [router.pathname]);

  return null;
}

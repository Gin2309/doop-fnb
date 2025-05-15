import { useEffect } from "react";
import { useRouter } from "next/router";
import { getToken, setToken } from "src/helpers/storage";

const useSyncLogoutAcrossTabs = () => {
  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "ACCESS_TOKEN" && !event.newValue) {
        router.push("/auth/sign-in");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);
};

export default useSyncLogoutAcrossTabs;

import "swiper/css/bundle";
import "../styles/global.css";

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import { Toaster } from "sonner";

import { getProfile } from "@/api/user.service";
import { getToken, setToken } from "@/helpers/storage";
import LayoutHandler from "@/hooks/LayoutHandler";
import { InitGlobalData } from "@/layouts/InitGlobalData";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import { I18nextProvider } from "react-i18next";
import i18n from "../components/i18n";

// import { messaging } from "@/utils/firebase/firebase";
// import { getToken as getNotiToken } from "firebase/messaging";

const MyApp = ({ Component, pageProps }: AppProps) => {
  // async function requestPermission() {
  //   const permission = await Notification.requestPermission();
  //   if (permission === "granted") {
  //     const token = await getNotiToken(messaging, {
  //       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  //     });
  //   } else if (permission === "denied") {
  //     console.log("Denied for the notification");
  //   }
  // }

  // useEffect(() => {
  //   requestPermission();
  // }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem("language") || "vi");
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const currentPath = window.location.pathname;
      const isAuthPath = currentPath.includes("auth");

      if (!token) {
        if (!isAuthPath) {
          router.replace("/auth/sign-in");
        } else {
          setIsLoading(false);
        }
        return;
      }

      try {
        await getProfile();
        setIsLoading(false);
      } catch (error: any) {
        if (
          error.status === 401 ||
          (error.response && error.response.status === 401)
        ) {
          setToken("");
          router.replace("/auth/sign-in");
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>.</div>;
  }

  const { dehydratedState } = pageProps as { dehydratedState: unknown };
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "inherit",
        },
      }}
    >
      <RecoilRoot>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
              <LayoutHandler />
              <Component {...pageProps} />
              <Toaster />
              <InitGlobalData />
              <ReactQueryDevtools />
            </Hydrate>
          </QueryClientProvider>
        </I18nextProvider>
      </RecoilRoot>
    </ConfigProvider>
  );
};

export default MyApp;

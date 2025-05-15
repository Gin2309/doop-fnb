import { message } from "antd";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import {
  clearToken,
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from "src/helpers/storage";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}`,

  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosClient.interceptors.request.use((config: AxiosRequestConfig): any => {
  const token = getToken();
  const currentPath = window.location.pathname;

  if (!currentPath.includes("auth")) {
    if (!token) {
      window.location.replace("/auth/sign-in");
      return Promise.reject("No access token, redirecting to login...");
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      message.error("Vui lòng đăng nhập để sử dụng!");
      setToken("");
      setTimeout(() => {
        window.location.replace("/auth/sign-in");
      }, 1000);
    }

    if (![200, 201, 204].includes(response.status)) {
      throw response.data;
    }

    if (response.config.method === "post") {
      const excludeUrl = [
        "auth/login",
        "auth/sign-up/",
        "external/image/upload",
        "order",
      ];

      // if (!excludeUrl.includes(response.config?.url as string)) {
      //   message.success("Thêm mới thành công!");
      // }
    } else if (
      response.config.method === "put" ||
      response.config.method === "patch"
    ) {
      // message.success("Cập nhật thành công!");
    } else if (response.config.method === "delete") {
      // message.success("Xóa thành công!");
    }

    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error: any) => {
    const { statusCode } = error.response?.data || {};

    if (statusCode === 401 || statusCode === 403) {
      message.error(
        "Phiên đã hết hạn hoặc yêu cầu không hợp lệ. Vui lòng đăng nhập lại."
      );
      setToken("");
      setTimeout(() => {
        window.location.replace("/auth/sign-in");
      }, 1000);
    }

    if (
      (error.response && error.response.status === 401) ||
      error.status === 401
    ) {
      setToken("");
      clearToken();
      window.location.replace("/auth/sign-in");
      const refreshTk = getRefreshToken();

      if (refreshTk) {
        const refreshTokenBody = { refreshTk };
        const res = await axios.post("/auth/refresh-token", refreshTokenBody);
        if (res.status === 200) {
          setRefreshToken(res.data);
        } else {
          // logout
          console.error("Refresh Token Error:", error);
        }
      } else {
        // logout
      }
    }
    throw error;
  }
);

export default axiosClient;

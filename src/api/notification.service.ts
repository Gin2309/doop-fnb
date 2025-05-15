import axiosClient from ".";

export const getNotification = ({
  phoneNumber,
  type,
  limit,
  page,
  sort,
}: {
  phoneNumber: string;
  type?: string;
  limit: number;
  page: number;
  sort?: string;
}) =>
  axiosClient.get("notification", {
    params: { phoneNumber, type, limit, page: page - 1, sort },
  });

export const seenNotification = (payload: any) =>
  axiosClient.put("notification/mark-as-seen", payload);

export const notiAction = (payload: any) =>
  axiosClient.patch("/employee/update/status", payload);

export const notiCount = () => axiosClient.get("/notification/count-unread");

import axiosClient from "./index";

export function uploadSingleFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  return axiosClient.post("file-storage/upload", formData, {
    headers: { "content-type": "multipart/form-data" },
  });
}

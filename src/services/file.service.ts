import { fetchApi } from "@/lib/api";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await fetchApi<{ url: string; format: string; resourceType: string }>(
    "/file/upload",
    { method: "POST", body: formData }
  );
};

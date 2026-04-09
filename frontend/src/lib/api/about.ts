import { api } from "../axios";
import { AboutInfo } from "@/types/models";

export const getAboutInfo = async (): Promise<AboutInfo> => {
  const response = await api.get("/about");
  return response.data;
};

export const updateAboutInfo = async (
  data: Partial<AboutInfo> | FormData,
): Promise<AboutInfo> => {
  const response = await api.put("/about", data);
  return response.data;
};

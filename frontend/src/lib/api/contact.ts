import { api } from "../axios";

export interface ContactData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  project?: string;
  type?: "contact" | "hire" | "direct";
}

export const sendContactEmail = async (data: ContactData) => {
  const response = await api.post("/contact", data);
  return response.data;
};

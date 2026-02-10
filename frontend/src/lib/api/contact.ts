import { api } from "../axios";

export interface ContactData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  project?: string;
  type?: "contact" | "hire" | "direct";
}

export interface ContactStats {
  total: number;
  thisMonth: number;
  byType: {
    hire: number;
    contact: number;
  };
}

export const sendContactEmail = async (data: ContactData) => {
  const response = await api.post("/contact", data);
  return response.data;
};

export const getContactStats = async (): Promise<ContactStats> => {
  const response = await api.get("/contact/stats");
  return response.data;
};

export const getContacts = async () => {
  const response = await api.get("/contact");
  return response.data;
};

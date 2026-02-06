import { api } from "../axios";
import { Service } from "@/types/models";

export const getServices = async () => {
    const { data } = await api.get<Service[]>("/services");
    return data;
}

export const createService = async (serviceData: Omit<Service, "_id">) => {
    const { data } = await api.post<Service>("/services", serviceData);
    return data;
}

export const updateService = async (id: string, serviceData: Partial<Service>) => {
    const { data } = await api.put<Service>(`/services/${id}`, serviceData);
    return data;
}

export const deleteService = async (id: string) => {
    const { data } = await api.delete(`/services/${id}`);
    return data;
}

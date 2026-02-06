import { api } from "../axios";
import { Settings } from "@/types/models";

export const getSettings = async () => {
    const { data } = await api.get<Settings[]>("/settings");
    // Backend returns an array, but we treat it as a singleton.
    // If empty, return null or a default object.
    return data[0] || null;
}

export const updateSettings = async (settingsData: FormData) => {
    const { data } = await api.put<Settings>("/settings", settingsData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

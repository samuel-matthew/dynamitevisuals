import { api } from "../axios";
import { Project } from "@/types/models";

export const getProjects = async () => {
    const { data } = await api.get<Project[]>("/projects");
    return data;
}

export const createProject = async (projectData: FormData) => {
    const { data } = await api.post<Project>("/projects", projectData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const updateProject = async (id: string, projectData: FormData) => {
    const { data } = await api.put<Project>(`/projects/${id}`, projectData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const deleteProject = async (id: string) => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
}

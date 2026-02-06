import { api } from "../axios";
import { Testimonial } from "@/types/models";

export const getTestimonials = async () => {
    const { data } = await api.get<Testimonial[]>("/testimonials");
    return data;
}

export const createTestimonial = async (formData: FormData) => {
    const { data } = await api.post<Testimonial>("/testimonials", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const updateTestimonial = async (id: string, formData: FormData) => {
    const { data } = await api.put<Testimonial>(`/testimonials/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const deleteTestimonial = async (id: string) => {
    const { data } = await api.delete(`/testimonials/${id}`);
    return data;
}

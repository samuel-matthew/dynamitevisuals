// import { api } from "../lib/axios.ts";
// import { AboutInfo, Project, Testimonial } from "@/types/models";

// // ABOUT
// export const getAboutInfo = async (): Promise<AboutInfo> => {
//   const { data } = await api.get("/about");

//   return data;
//   //   {
//   //     name: data.name,
//   //     title: data.title,
//   //     bio: data.bio,
//   //     philosophy: data.philosophy,
//   //     profileImage: data.profileImage,
//   //     stats: data.stats,
//   //     tools: data.tools,
//   //   };
// };

// export const updateAboutInfo = async (data: FormData) => {
//   const res = await api.put("/about", data, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// // PROJECTS
// export const getProjects = async (): Promise<Project[]> => {
//   const { data } = await api.get("/projects");
//   return data;
// };

// // TESTIMONIALS
// export const getTestimonials = async (): Promise<Testimonial[]> => {
//   const { data } = await api.get("/testimonials");
//   return data;
// };







export interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  philosophy: string;
  profileImage: string;
  stats: {
    label: string;
    value: string;
  }[];
  tools: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

// Mock Projects Data
import { Project } from "@/types/models";

export const mockProjects: Project[] = [
  {
    _id: "1",
    title: "Nike 'Rise' Campaign",
    category: "Video Editing",
    thumbnail: {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        public_id: "mock1"
    },
    description: "A high-energy brand film showcasing athletic excellence.",
    role: "Lead Editor",
    tools: ["Premiere Pro", "After Effects"],
    featured: true,
    createdAt: "2024-01-15",
  },
   {
    _id: "2",
    title: "FinTech App Launch",
    category: "Motion Graphics",
    thumbnail: {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        public_id: "mock2"
    },
    description: "Dynamic explainer video for a revolutionary finance app.",
    role: "Motion Designer",
    tools: ["After Effects", "Cinema 4D"],
    featured: true,
    createdAt: "2024-02-20",
  },
  {
    _id: "3",
    title: "Cosmos Documentary",
    category: "Video Editing",
    thumbnail: {
        url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
        public_id: "mock3"
    },
    description: "Award-winning documentary about space exploration.",
    role: "Editor & Colorist",
    tools: ["DaVinci Resolve", "Premiere Pro"],
    featured: false,
    createdAt: "2024-03-10",
  }
];

import { Service } from "@/types/models";

export const mockServices: Service[] = [
  {
    _id: "1",
    icon: "Film",
    title: "Video Editing",
    description:
      "Professional video editing for commercials, films, and social media content.",
    features: ["Color Grading", "Sound Design", "Transitions", "Storytelling"],
  },
  {
    _id: "2",
    icon: "Sparkles",
    title: "Motion Graphics",
    description: "Eye-catching animated graphics and visual effects.",
    features: [
      "Logo Animation",
      "Title Sequences",
      "Infographics",
      "Visual Effects",
    ],
  },
  {
    _id: "3",
    icon: "Clapperboard",
    title: "Animation",
    description: "2D and 3D character animation and explainer videos.",
    features: [
      "Character Animation",
      "Explainer Videos",
      "3D Modeling",
      "Rigging",
    ],
  },
];

import { Testimonial } from "@/types/models";

// ... (other interfaces unchanged if not replacing whole file)

export const mockTestimonials: Testimonial[] = [
  {
    _id: "1",
    name: "Sarah Chen",
    role: "Marketing Director, TechFlow",
    avatar: {
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        public_id: "mock1"
    },
    content:
      "Peter transformed our product launch video into a viral sensation. The attention to detail and creative vision exceeded our expectations.",
    rating: 5,
  },
  {
    _id: "2",
    name: "Marcus Johnson",
    role: "Founder, CreativeStudios",
    avatar: {
        url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
        public_id: "mock2"
    },
    content:
      "Working with Peter is a game-changer. Fast turnarounds, incredible quality, and always open to feedback.",
    rating: 5,
  },
  {
    _id: "3",
    name: "Emma Williams",
    role: "Content Creator, 2M Followers",
    avatar: {
        url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
        public_id: "mock3"
    },
    content:
      "My YouTube engagement doubled after Peter started editing my videos. The pacing, effects, and overall production value are unmatched.",
    rating: 5,
  },
];

export const mockAboutInfo: AboutInfo = {
  name: "Peter Udoh",
  title: "Video Editor & Motion Designer",
  bio: "I'm Peter Udoh, a passionate video editor and motion designer. For over 8 years, I've been helping brands, agencies, and creators tell their stories through compelling visual content.",
  philosophy:
    "My expertise spans cinematic storytelling, dynamic motion graphics, and precision editing. I believe in creating content that not only looks stunning but also connects with audiences on an emotional level.",
  profileImage:
    "https://images.unsplash.com/photo-1599566150163-29194d6b4153?w=800",
  stats: [
    { label: "Years Experience", value: "8+" },
    { label: "Projects Completed", value: "200+" },
    { label: "Happy Clients", value: "50+" },
    { label: "Awards Won", value: "12" },
  ],
  tools: [
    "Premiere Pro",
    "After Effects",
    "DaVinci Resolve",
    "Cinema 4D",
    "Blender",
    "Photoshop",
  ],
};

export const mockContactInfo: ContactInfo = {
  email: "contact@dynamitevisuals.com",
  phone: "+234 703 105 5642",
  whatsapp: "+234 703 105 5642",
  socialLinks: [
    { platform: "YouTube", url: "https://youtube.com/@dynamitevisuals" },
    { platform: "Instagram", url: "https://instagram.com/dynamitevisuals" },
    { platform: "Facebook", url: "https://facebook.com/dynamitevisuals" },
  ],
};

export const projectCategories = [
  "Video Editing",
  "Motion Graphics",
  "Animation",
  "Color Grading",
  "Sound Design",
];

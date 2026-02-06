export interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  role: string;
  tools: string[];
  thumbnail?: {
    url: string;
    public_id: string;
  };
  video?: {
    url: string;
    public_id: string;
  };
  featured: boolean;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  avatar: {
    url: string;
    public_id: string;
  };
  content: string;
  rating: number;
}

export interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  philosophy: string;
  profileImage: {
    url: string;
    public_id: string;
  } | string;
  stats: {
    label: string;
    value: string;
  }[];
  tools: {
    name: string;
    _id?: string;
  }[];
}

export interface Service {
  _id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface Settings {
  _id: string;
  email: string;
  phone: string;
  whatsapp: string;
  socials: {
    _id?: string;
    label: string;
    value: string;
  }[];
  showreel?: {
    url: string;
    public_id: string;
  };
}

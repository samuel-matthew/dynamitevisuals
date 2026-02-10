import { api } from "../axios";

export interface AnalyticsStats {
  totalViews: number;
  recentStats: {
    _id: string;
    path: string;
    views: number;
    uniqueVisitors: number;
    date: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export const recordView = async (path: string) => {
  try {
    await api.post("/analytics", { path });
  } catch (error) {
    console.error("Failed to record view:", error);
  }
};

export const getAnalyticsStats = async (): Promise<AnalyticsStats> => {
  const response = await api.get("/analytics/stats");
  return response.data;
};

import axiosConfig from "../config/axios.config";
import type { Activity, DashboardStats, Overview } from "../types";



export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axiosConfig.get<DashboardStats>("/dashboard/public/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const getRecentActivities = async (): Promise<Activity[]> => {
  try {
    const response = await axiosConfig.get<Activity[]>("/dashboard/public/recent-activities");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
};

export const getDashboardOverview = async (): Promise<Overview> => {
  try {
    const [statsData, activitiesData] = await Promise.all([
      getDashboardStats(),
      getRecentActivities(),
    ]);
    return {
      stats: statsData,
      recentActivities: activitiesData,
    };
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    throw error;
  }
};

import axiosConfig from "../config/axios.config";
import type { Actualite, NewsResponse } from "../types/news.types";



export const getNews = async (): Promise<Actualite[]> => {
  try {
    const response = await axiosConfig.get<NewsResponse>("/news");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const getNewsBySlug = async (slug: string): Promise<Actualite> => {
  try {
    const response = await axiosConfig.get<Actualite>(`/news/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    throw error;
  }
};
import axiosConfig from "../config/axios.config";
import type { ContactFormData } from "../types/contact.types";

export const createContactMessage = async (data: ContactFormData): Promise<void> => {
    await axiosConfig.post("/messages", data);
};
import { apiClient } from '@/api/client/http';
import { endpoints } from '@/api/endpoints';

const admissionService = {
  async createAdmission(data: FormData): Promise<void> {
    await apiClient.post(endpoints.admissions, data);
  },
};

export default admissionService;
export { admissionService as AdmissionService };

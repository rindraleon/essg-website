import axiosConfig from '../config/axios.config';

class AdmissionService {
  async createAdmission(data: FormData): Promise<void> {
    await axiosConfig.post('/admissions', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getAllAdmissions() {
    const response = await axiosConfig.get('/admissions');
    return response.data;
  }

  async getAdmissionById(id: number) {
    const response = await axiosConfig.get(`/admissions/${id}`);
    return response.data;
  }

  async updateAdmissionStatus(id: number, statut: string, commentaire?: string): Promise<void> {
    await axiosConfig.patch(`/admissions/${id}/status`, { statut, commentaire });
  }

  async deleteAdmission(id: number): Promise<void> {
    await axiosConfig.delete(`/admissions/${id}`);
  }
}

const admissionService = new AdmissionService();
export default admissionService;
export { AdmissionService };

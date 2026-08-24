export { login, logout, verifyToken } from './auth.service';
export {
  createFormation,
  deleteFormation,
  getAllFormations,
  updateFormation,
} from './formations.service';
export {
  createActualite,
  deleteActualite,
  getAllActualites,
  updateActualite,
} from './actualites.service';
export {
  createRessourceHumaine,
  deleteRessourceHumaine,
  getAllRessourcesHumaines,
  updateRessourceHumaine,
} from './ressources-humaines.service';
export {
  createProjet,
  deleteProjet,
  getAllProjets,
  updateProjet,
  uploadImage,
} from './projets.service';
export {
  createPartenaire,
  deletePartenaire,
  getAllPartenaires,
  updatePartenaire,
} from './partenaires.service';
export { getDashboardStats, getRecentActivities } from './dashboard.service';
export { createUser, deleteUser, getAllUsers, updateUser, uploadAvatar } from './users.service';
export {
  deleteAdmission,
  deleteAdmissionFile,
  getAdmissionById,
  getAdmissionFileBlob,
  getAllAdmissions,
  updateAdmissionStatus,
} from './admissions.service';
export type { AdmissionQuery } from './admissions.service';
export { getActivityLogs } from './activity-logs.service';
export { getSettings, updateSettings } from './settings.service';
export { ACCEPTED_CV_TYPES, OcrError, analyzeCv } from './ocr.service';
export type { OcrProgress, OcrResult } from './ocr.service';
export {
  deleteMessage,
  getAllMessages,
  replyToMessage,
  searchMessages,
  updateMessage,
} from './messages.service';
export type { Message, PaginationQuery } from './messages.service';

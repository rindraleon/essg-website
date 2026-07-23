export type Admission = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance: string;
  niveau: string;
  formation: string;
  diplomePrecedent: string;
  cvPath?: string;
  lettreMotivationPath?: string;
  statut: 'en_attente' | 'en_cours_etude' | 'accepte' | 'refuse';
  commentaire?: string;
  creeLe: string;
  misAJourLe: string;
};

export type AdmissionStatus = 'en_attente' | 'en_cours_etude' | 'accepte' | 'refuse';
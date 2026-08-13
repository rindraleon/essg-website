import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowRight, LoaderCircle, Save, Upload } from 'lucide-react';
import { toUpperName } from '../../utils/slug.utils';
import type { AdmissionFormData, AdmissionFormProps } from '../../types';
import { useCreateAdmission } from '../../hooks/mutations';
import { ApiError } from '@/api/types/api';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

const INITIAL_FORM_DATA: AdmissionFormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  dateNaissance: '',
  niveau: '',
  formation: '',
  diplomePrecedent: '',
  accepteConditions: false,
};

const DEFAULT_NIVEAUX = [
  { value: 'licence', label: 'Licence' },
  { value: 'master', label: 'Master' },
  { value: 'doctorat', label: 'Doctorat' },
];

const DEFAULT_FORMATIONS = [
  { value: 'geomatique-applications', label: 'Géomatique et Applications' },
  { value: 'geomatique-management', label: 'Géomatique et Management' },
  { value: 'informatique-donnees', label: 'Informatique et Données Spatiales' },
];

const AdmissionForm = ({
  niveaux = DEFAULT_NIVEAUX,
  formations = DEFAULT_FORMATIONS,
  onSubmit,
}: AdmissionFormProps) => {
  const [formData, setFormData] = useState<AdmissionFormData>(INITIAL_FORM_DATA);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [lettreFile, setLettreFile] = useState<File | null>(null);
  const createAdmission = useCreateAdmission();
  const loading = createAdmission.isPending;

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nom' ? toUpperName(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.accepteConditions) {
      toast.error('Veuillez accepter les conditions générales.');
      return;
    }
    if (!cvFile || !lettreFile) {
      toast.error('Veuillez joindre le CV et la lettre de motivation.');
      return;
    }

    const payload = new FormData();
    payload.append('nom', formData.nom);
    payload.append('prenom', formData.prenom);
    payload.append('email', formData.email);
    payload.append('telephone', formData.telephone);
    payload.append('dateNaissance', formData.dateNaissance);
    payload.append('niveau', formData.niveau);
    payload.append('formation', formData.formation);
    payload.append('diplomePrecedent', formData.diplomePrecedent);
    payload.append('cv', cvFile);
    payload.append('lettreMotivation', lettreFile);

    try {
      await createAdmission.mutateAsync(payload);
      onSubmit?.(formData);
      toast.success('Candidature soumise avec succès ! Vous recevrez un email de confirmation.');
      setFormData(INITIAL_FORM_DATA);
      setCvFile(null);
      setLettreFile(null);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Une erreur est survenue lors de la soumission. Veuillez réessayer.',
      );
    }
  };

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-ink-100 bg-white p-6 shadow-card sm:p-8">
      <h2 className="mb-2 text-2xl font-bold text-ink-900">Formulaire de candidature</h2>
      <p className="mb-8 text-sm text-ink-500">
        Remplissez ce formulaire pour soumettre votre candidature. Assurez-vous de fournir des
        informations exactes.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-ink-900">Informations personnelles</h3>
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                name="prenom"
                autoComplete="given-name"
                value={formData.prenom}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                name="nom"
                autoComplete="family-name"
                value={formData.nom}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                autoComplete="tel"
                value={formData.telephone}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="dateNaissance">Date de naissance</Label>
              <Input
                id="dateNaissance"
                name="dateNaissance"
                type="date"
                autoComplete="bday"
                value={formData.dateNaissance}
                onChange={handleTextChange}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-ink-900">Formation souhaitée</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select name="niveau" label="Niveau *" value={formData.niveau} onChange={handleTextChange} required>
              <option value="">Choisir un niveau</option>
              {niveaux.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            <Select
              name="formation"
              label="Formation *"
              value={formData.formation}
              onChange={handleTextChange}
              required
            >
              <option value="">Choisir une formation</option>
              {formations.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-ink-900">Parcours académique</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="diplomePrecedent">Dernier diplôme obtenu</Label>
              <Input
                id="diplomePrecedent"
                name="diplomePrecedent"
                value={formData.diplomePrecedent}
                onChange={handleTextChange}
                placeholder="Ex: Baccalauréat scientifique, Licence en géographie..."
                required
              />
            </div>
            <div>
              <Label htmlFor="cv" className="mb-2 block">
                CV (PDF) *
              </Label>
              <label className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-600 transition-colors hover:border-brand-600 hover:bg-brand-50">
                <Upload className="size-4" />
                {cvFile ? cvFile.name : 'Choisir un fichier'}
                <input
                  id="cv"
                  type="file"
                  accept=".pdf"
                  required
                  className="sr-only"
                  onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <div>
              <Label htmlFor="lettre" className="mb-2 block">
                Lettre de motivation (PDF) *
              </Label>
              <label className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-600 transition-colors hover:border-brand-600 hover:bg-brand-50">
                <Upload className="size-4" />
                {lettreFile ? lettreFile.name : 'Choisir un fichier'}
                <input
                  id="lettre"
                  type="file"
                  accept=".pdf"
                  required
                  className="sr-only"
                  onChange={(e) => setLettreFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
          <Checkbox
            checked={formData.accepteConditions}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, accepteConditions: e.target.checked }))
            }
            label="J'accepte les conditions générales *"
          />
          <p className="mt-2 pl-6 text-sm text-ink-500">
            Je certifie que les informations fournies sont exactes et je comprends que toute fausse
            déclaration peut entraîner le rejet de ma candidature.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Soumission en cours...' : 'Soumettre ma candidature'}
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
          </Button>
          <Button type="button" variant="outline" className="w-full">
            <Save className="size-4" />
            Sauvegarder comme brouillon
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;

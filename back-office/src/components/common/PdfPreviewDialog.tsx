import { Download, FileText, FileWarning, LoaderCircle, Minus, Plus, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/api/types/api';
import type { DocumentBlob } from '@/api/client/http';

interface PdfPreviewDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  loadDocument: () => Promise<Blob | DocumentBlob>;
  fileName: string;
}

/** Nature du contenu, qui détermine le mode de rendu. */
type Kind = 'pdf' | 'image' | 'unsupported';

function resolveKind(blob: Blob | DocumentBlob): Kind {
  const type = blob.type || '';
  if (type.includes('pdf')) return 'pdf';
  if (type.startsWith('image/')) return 'image';
  // Word, archives, binaires : aucun rendu natif dans une iframe.
  return 'unsupported';
}

/**
 * Aperçu de document (CV, lettre de motivation).
 *
 * Correctifs apportés au diagnostic « le document ne s'affiche pas » :
 *
 *  1. Le backend renvoyait `application/pdf` pour TOUS les documents, alors
 *     que l'upload accepte aussi Word et images. Combiné à l'en-tête
 *     `X-Content-Type-Options: nosniff`, le navigateur recevait un contenu
 *     ZIP/JPEG étiqueté PDF et refusait de l'afficher : iframe blanche.
 *     Le type est désormais détecté à partir de la signature du fichier.
 *
 *  2. Une image est rendue avec `<img>` plutôt qu'une iframe : l'affichage
 *     est fiable et le zoom réellement applicable.
 *
 *  3. Un format non affichable (Word) n'ouvre plus une iframe vide : un écran
 *     explicite propose le téléchargement.
 *
 *  4. `loadDocument` est appelé via une référence stable : si le parent
 *     recrée la fonction à chaque rendu, l'effet ne se relance plus en boucle
 *     (le document était rechargé sans fin).
 */
const PdfPreviewDialog = ({
  open,
  title,
  onClose,
  loadDocument,
  fileName,
}: PdfPreviewDialogProps) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  // Référence toujours à jour, sans être une dépendance de l'effet : évite
  // de relancer le chargement à chaque rendu du parent.
  const loadRef = useRef(loadDocument);
  useEffect(() => {
    loadRef.current = loadDocument;
  }, [loadDocument]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let createdUrl: string | null = null;

    const run = async () => {
      setLoading(true);
      setError(null);
      setZoom(100);
      try {
        const blob = await loadRef.current();
        if (cancelled) return;

        const detected = resolveKind(blob);
        setKind(detected);

        // Une iframe ne sait pas rendre un .docx : inutile de créer l'URL,
        // l'écran de téléchargement prend le relais.
        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Le document n'a pas pu être chargé. Réessayez ou téléchargez-le.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setObjectUrl(null);
    };
  }, [open]);

  const handleDownload = useCallback(() => {
    if (!objectUrl) return;
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [objectUrl, fileName]);

  // Fermeture au clavier : réflexe attendu sur une modale plein écran.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canZoom = Boolean(objectUrl) && kind !== 'unsupported';
  const showViewer = Boolean(objectUrl) && !loading && !error;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/80 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-4 py-3">
          <h2 className="text-base font-bold text-ink-900 sm:text-lg">{title}</h2>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setZoom((value) => Math.max(50, value - 25))}
              disabled={!canZoom}
              aria-label="Réduire"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span
              data-numeric
              className="min-w-12 text-center text-xs font-semibold text-ink-600"
            >
              {zoom}%
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setZoom((value) => Math.min(200, value + 25))}
              disabled={!canZoom}
              aria-label="Agrandir"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDownload}
              disabled={!objectUrl}
            >
              <Download className="mr-1 h-4 w-4" />
              Télécharger
            </Button>

            <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label="Fermer">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 bg-ink-100">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-600">
              <LoaderCircle className="h-8 w-8 animate-spin text-brand-600" />
              Chargement du document…
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-ink-600">
              <FileWarning className="h-8 w-8 text-red-600" />
              <p className="max-w-md">{error}</p>
            </div>
          )}

          {/* PDF : rendu par la visionneuse native du navigateur */}
          {showViewer && kind === 'pdf' && (
            <div className="h-full overflow-auto">
              <iframe
                title={title}
                src={objectUrl as string}
                className="h-full w-full origin-top-left border-0 bg-white"
                style={{
                  width: `${zoom}%`,
                  height: `${Math.max(100, zoom)}%`,
                  minHeight: '100%',
                }}
              />
            </div>
          )}

          {/* Image : rendu direct, plus fiable qu'une iframe */}
          {showViewer && kind === 'image' && (
            <div className="h-full overflow-auto p-4">
              <img
                src={objectUrl as string}
                alt={title}
                className="mx-auto h-auto bg-white shadow-sm"
                style={{ width: `${zoom}%`, maxWidth: zoom <= 100 ? '100%' : 'none' }}
              />
            </div>
          )}

          {/* Format sans rendu natif : on l'annonce et on propose le fichier */}
          {showViewer && kind === 'unsupported' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <FileText className="h-10 w-10 text-ink-400" />
              <div>
                <p className="font-medium text-ink-800">
                  Ce format ne peut pas être affiché dans le navigateur
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Téléchargez le document pour l'ouvrir avec l'application adaptée.
                </p>
              </div>
              <Button type="button" onClick={handleDownload}>
                <Download className="mr-1 h-4 w-4" />
                Télécharger le document
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewDialog;

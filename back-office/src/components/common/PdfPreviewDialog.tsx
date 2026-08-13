import { Download, FileWarning, LoaderCircle, Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/api/types/api';

interface PdfPreviewDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  loadDocument: () => Promise<Blob>;
  fileName: string;
}

const PdfPreviewDialog = ({ open, title, onClose, loadDocument, fileName }: PdfPreviewDialogProps) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (!open) return;
    let revoked = false;
    let createdUrl: string | null = null;

    const run = async () => {
      setLoading(true);
      setError(null);
      setZoom(100);
      try {
        const blob = await loadDocument();
        createdUrl = URL.createObjectURL(blob);
        if (!revoked) setObjectUrl(createdUrl);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Document introuvable');
      } finally {
        if (!revoked) setLoading(false);
      }
    };

    void run();

    return () => {
      revoked = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setObjectUrl(null);
    };
  }, [open, loadDocument]);

  if (!open) return null;

  const handleDownload = () => {
    if (!objectUrl) return;
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/80 p-3 sm:p-6">
      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-4 py-3">
          <h2 className="text-base font-bold text-ink-900 sm:text-lg">{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setZoom((value) => Math.max(75, value - 25))}
              disabled={!objectUrl}
              aria-label="Réduire"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-12 text-center text-xs font-semibold text-ink-600">{zoom}%</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setZoom((value) => Math.min(200, value + 25))}
              disabled={!objectUrl}
              aria-label="Agrandir"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={handleDownload} disabled={!objectUrl}>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-ink-600">
              <FileWarning className="h-8 w-8 text-red-600" />
              <p>{error}</p>
            </div>
          )}
          {objectUrl && !loading && !error && (
            <div className="h-full overflow-auto">
              <iframe
                title={title}
                src={objectUrl}
                className="h-full w-full origin-top-left border-0 bg-white"
                style={{ width: `${zoom}%`, height: `${Math.max(100, zoom)}%`, minHeight: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewDialog;

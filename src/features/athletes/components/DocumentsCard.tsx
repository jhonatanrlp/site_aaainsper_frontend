import { Eye, FileText, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '../../../components/feedback/EmptyState.js';
import { Badge } from '../../../components/ui/badge.js';
import { Button } from '../../../components/ui/button.js';
import { Card, CardBody, CardHeader } from '../../../components/ui/card.js';
import { ApiError } from '../../../lib/api/unwrap.js';
import { formatDateTime } from '../../../lib/format.js';
import {
  ALLOWED_UPLOAD_TYPES,
  DOCUMENT_STATUS,
  DOCUMENT_TYPE_LABEL,
  needsAction,
  openDocument,
  useUploadDocument,
  validateUploadFile,
  type AthleteDocument,
} from '../../documents/hooks.js';

function DocumentRow({ document, athleteId }: { document: AthleteDocument; athleteId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [opening, setOpening] = useState(false);
  const upload = useUploadDocument(athleteId);
  const status = DOCUMENT_STATUS[document.status];
  const canView = document.storagePath !== null;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const problem = validateUploadFile(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    try {
      await upload.mutateAsync({ requiredDocumentId: document.requiredDocumentId, file });
      toast.success('Documento enviado — aguarde a análise.');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Não foi possível enviar o arquivo.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleView() {
    setOpening(true);
    try {
      await openDocument(document.id);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Não foi possível abrir o arquivo.');
    } finally {
      setOpening(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)]">
          <FileText className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-[var(--color-ink)]">
              {DOCUMENT_TYPE_LABEL[document.type]}
            </p>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          {document.status === 'rejected' && document.rejectionReason && (
            <p className="mt-1 text-sm text-[var(--color-danger-600)]">
              Motivo: {document.rejectionReason}
            </p>
          )}
          {document.uploadedAt && (
            <p className="mt-0.5 text-xs text-[var(--color-ink-subtle)]">
              Enviado em {formatDateTime(document.uploadedAt)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {canView && (
          <Button variant="ghost" size="sm" onClick={handleView} disabled={opening}>
            {opening ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            Ver
          </Button>
        )}
        {(needsAction(document) || document.status === 'submitted') && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_UPLOAD_TYPES.join(',')}
              className="sr-only"
              aria-label={`Selecionar arquivo: ${DOCUMENT_TYPE_LABEL[document.type]}`}
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
            <Button
              variant={needsAction(document) ? 'primary' : 'outline'}
              size="sm"
              disabled={upload.isPending}
              onClick={() => inputRef.current?.click()}
            >
              {upload.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {upload.isPending ? 'Enviando…' : document.storagePath ? 'Reenviar' : 'Enviar'}
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

export function DocumentsCard({
  documents,
  athleteId,
}: {
  documents: AthleteDocument[];
  athleteId: string;
}) {
  return (
    <Card>
      <CardHeader
        title="Documentos"
        description="PDF, JPEG ou PNG, até 10 MB. A análise é feita pelo diretor da modalidade."
      />
      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento exigido ainda"
          description="Os documentos aparecem aqui depois que sua entrada em uma equipe for aprovada."
        />
      ) : (
        <CardBody className="p-0">
          <ul className="divide-y divide-[var(--color-border)]">
            {documents.map((document) => (
              <DocumentRow key={document.id} document={document} athleteId={athleteId} />
            ))}
          </ul>
        </CardBody>
      )}
    </Card>
  );
}

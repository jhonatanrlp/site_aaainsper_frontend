import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/client.js';
import { unwrap } from '../../lib/api/unwrap.js';

export type DocumentStatus = 'pending' | 'submitted' | 'approved' | 'rejected';
export type DocumentType = 'id_document' | 'photo_3x4' | 'enrollment_declaration';

export interface AthleteDocument {
  id: string;
  athleteId: string;
  requiredDocumentId: string;
  status: DocumentStatus;
  storagePath: string | null;
  uploadedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  expiresAt: string | null;
  type: DocumentType;
  required: boolean;
}

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  id_document: 'Documento de identidade',
  photo_3x4: 'Foto 3x4',
  enrollment_declaration: 'Declaração de matrícula',
};

export const DOCUMENT_STATUS: Record<
  DocumentStatus,
  { label: string; variant: 'warning' | 'brand' | 'success' | 'danger' }
> = {
  pending: { label: 'Pendente', variant: 'warning' },
  submitted: { label: 'Em análise', variant: 'brand' },
  approved: { label: 'Aprovado', variant: 'success' },
  rejected: { label: 'Rejeitado', variant: 'danger' },
};

// Documents the athlete still has to act on (send, or resend after rejection).
export function needsAction(document: AthleteDocument): boolean {
  return document.status === 'pending' || document.status === 'rejected';
}

// UX pre-check only — the backend re-validates type and size.
export const ALLOWED_UPLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function validateUploadFile(file: File): string | null {
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) return 'Envie um arquivo PDF, JPEG ou PNG.';
  if (file.size > MAX_UPLOAD_BYTES) return 'O arquivo deve ter no máximo 10 MB.';
  return null;
}

export function useUploadDocument(athleteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requiredDocumentId, file }: { requiredDocumentId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      return unwrap<AthleteDocument>(
        api.POST('/athletes/{id}/documents/{requiredDocumentId}', {
          params: { path: { id: athleteId, requiredDocumentId } },
          // The route accepts multipart (not JSON), which the generated
          // schema doesn't describe — hence the casts.
          body: formData as never,
          bodySerializer: (body: unknown) => body as FormData,
        }),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['athletes'] }),
  });
}

// Must be called synchronously from a click handler: the tab is opened
// immediately (so popup blockers allow it) and pointed at the short-lived
// signed URL once the backend has issued it.
export async function openDocument(documentId: string): Promise<void> {
  const tab = window.open('', '_blank');
  try {
    const { url } = await unwrap<{ url: string }>(
      api.GET('/documents/{id}/download-url', { params: { path: { id: documentId } } }),
    );
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.assign(url);
    }
  } catch (error) {
    tab?.close();
    throw error;
  }
}

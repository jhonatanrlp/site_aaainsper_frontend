export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchResult {
  data?: unknown;
  error?: unknown;
  response: Response;
}

function readBackendError(error: unknown): { code: string; message: string } | null {
  if (typeof error !== 'object' || error === null) return null;
  const inner = (error as { error?: { code?: unknown; message?: unknown } }).error;
  if (!inner || typeof inner.message !== 'string') return null;
  return { code: typeof inner.code === 'string' ? inner.code : 'UNKNOWN', message: inner.message };
}

// Turns an openapi-fetch result into either the response body or a thrown
// ApiError carrying the backend's own error code/message (the backend
// always answers { error: { code, message } }). The response body type is
// supplied by the caller because the backend doesn't declare response
// schemas in OpenAPI yet — see the README's "Known limitation".
export async function unwrap<T>(request: Promise<FetchResult>): Promise<T> {
  const result = await request;
  if (!result.response.ok) {
    const parsed = readBackendError(result.error);
    throw new ApiError(
      result.response.status,
      parsed?.code ?? 'UNKNOWN',
      parsed?.message ?? 'Não foi possível concluir a operação.',
    );
  }
  return result.data as T;
}

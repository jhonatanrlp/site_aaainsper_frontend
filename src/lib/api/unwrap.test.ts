import { describe, expect, it } from 'vitest';
import { ApiError, unwrap } from './unwrap.js';

const ok = (data: unknown) =>
  Promise.resolve({ data, response: new Response(null, { status: 200 }) });
const fail = (status: number, error: unknown) =>
  Promise.resolve({ error, response: new Response(null, { status }) });

describe('unwrap', () => {
  it('returns the response body on success', async () => {
    await expect(unwrap<{ a: number }>(ok({ a: 1 }))).resolves.toEqual({ a: 1 });
  });

  it("throws an ApiError carrying the backend's own code, status and message", async () => {
    const error = unwrap(
      fail(409, { error: { code: 'CONFLICT', message: 'A pending request already exists' } }),
    );
    await expect(error).rejects.toMatchObject({
      name: 'ApiError',
      status: 409,
      code: 'CONFLICT',
      message: 'A pending request already exists',
    });
    await expect(error).rejects.toBeInstanceOf(ApiError);
  });

  it('falls back to a generic message when the error body has an unexpected shape', async () => {
    await expect(unwrap(fail(500, 'boom'))).rejects.toMatchObject({
      status: 500,
      code: 'UNKNOWN',
      message: 'Não foi possível concluir a operação.',
    });
  });
});

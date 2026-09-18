import { describe, expect, it } from 'vitest';
import {
  MAX_UPLOAD_BYTES,
  needsAction,
  validateUploadFile,
  type AthleteDocument,
} from './hooks.js';

function file(name: string, type: string, size = 10): File {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
}

describe('validateUploadFile', () => {
  it.each(['application/pdf', 'image/jpeg', 'image/png'])('accepts %s', (type) => {
    expect(validateUploadFile(file('doc', type))).toBeNull();
  });

  it('rejects unsupported types', () => {
    expect(validateUploadFile(file('virus.exe', 'application/x-msdownload'))).toMatch(
      /PDF, JPEG ou PNG/,
    );
  });

  it('rejects files over 10 MB and accepts exactly 10 MB', () => {
    expect(validateUploadFile(file('big.pdf', 'application/pdf', MAX_UPLOAD_BYTES + 1))).toMatch(
      /10 MB/,
    );
    expect(validateUploadFile(file('ok.pdf', 'application/pdf', MAX_UPLOAD_BYTES))).toBeNull();
  });
});

describe('needsAction', () => {
  const base = { id: 'd', athleteId: 'a', requiredDocumentId: 'r' } as AthleteDocument;

  it('is true for pending and rejected documents only', () => {
    expect(needsAction({ ...base, status: 'pending' })).toBe(true);
    expect(needsAction({ ...base, status: 'rejected' })).toBe(true);
    expect(needsAction({ ...base, status: 'submitted' })).toBe(false);
    expect(needsAction({ ...base, status: 'approved' })).toBe(false);
  });
});

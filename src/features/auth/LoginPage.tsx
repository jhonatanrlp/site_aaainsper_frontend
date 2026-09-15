import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button.js';
import { useAuth } from './AuthContext.js';
import { isAllowedEmail, requestOtp, verifyOtp } from './authApi.js';
import { env } from '../../lib/env.js';

type Step = { name: 'email' } | { name: 'code'; email: string };

export function LoginPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>({ name: 'email' });
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isAllowedEmail(email)) {
      setError(`Use seu e-mail institucional (@${env.VITE_ALLOWED_EMAIL_DOMAIN}).`);
      return;
    }

    setSubmitting(true);
    try {
      await requestOtp(email);
      setStep({ name: 'code', email });
      toast.success('Código enviado — confira sua caixa de entrada.');
    } catch {
      setError('Não foi possível enviar o código. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (step.name !== 'code') return;
    setError(null);
    setSubmitting(true);
    try {
      await verifyOtp(step.email, code);
      await refreshProfile();
      navigate('/sistema/atleta', { replace: true });
    } catch {
      setError('Código inválido ou expirado.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-brand-950)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-accent-500)] text-base font-bold text-[var(--color-brand-950)]">
            AI
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-ink)]">Atlética Insper</h1>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Acesse com seu e-mail institucional
            </p>
          </div>
        </div>

        {step.name === 'email' ? (
          <form className="space-y-4" onSubmit={handleRequestOtp}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                placeholder={`voce@${env.VITE_ALLOWED_EMAIL_DOMAIN}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-brand-600)] focus:ring-1 focus:ring-[var(--color-brand-600)]"
              />
            </div>
            {error && <p className="text-sm text-[var(--color-danger-600)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Enviando…' : 'Enviar código'}
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Enviamos um código para{' '}
              <span className="font-medium text-[var(--color-ink)]">{step.email}</span>.
            </p>
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium text-[var(--color-ink)]">
                Código
              </label>
              <input
                id="code"
                inputMode="numeric"
                required
                autoFocus
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-center text-lg tracking-[0.5em] outline-none transition-colors focus:border-[var(--color-brand-600)] focus:ring-1 focus:ring-[var(--color-brand-600)]"
              />
            </div>
            {error && <p className="text-sm text-[var(--color-danger-600)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Verificando…' : 'Entrar'}
            </Button>
            <button
              type="button"
              className="w-full text-center text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              onClick={() => setStep({ name: 'email' })}
            >
              Usar outro e-mail
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

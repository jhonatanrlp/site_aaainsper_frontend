import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../../components/ui/button.js';
import { api } from '../../lib/api/client.js';
import { useAuth } from './AuthContext.js';

const completeProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Informe seu nome completo'),
  cpf: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')),
  rg: z.string().trim().min(1, 'Informe seu RG'),
  birthDate: z.string().min(1, 'Informe sua data de nascimento'),
  course: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

type FormValues = z.infer<typeof completeProfileSchema>;

const fields: { name: keyof FormValues; label: string; type?: string; required?: boolean }[] = [
  { name: 'fullName', label: 'Nome completo', required: true },
  { name: 'cpf', label: 'CPF', required: true },
  { name: 'rg', label: 'RG', required: true },
  { name: 'birthDate', label: 'Data de nascimento', type: 'date', required: true },
  { name: 'course', label: 'Curso' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'phone', label: 'Telefone' },
];

export function CompleteProfilePage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(completeProfileSchema) });

  async function onSubmit(values: FormValues) {
    const { error } = await api.PATCH('/users/me', { body: values });
    if (error) {
      toast.error('Não foi possível salvar seu perfil.');
      return;
    }
    await refreshProfile();
    toast.success('Perfil completo!');
    navigate('/sistema/atleta', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-muted)] px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-[var(--color-ink)]">Complete seu perfil</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Precisamos de mais alguns dados antes de continuar.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.name === 'fullName' ? 'sm:col-span-2 space-y-1.5' : 'space-y-1.5'}
              >
                <label htmlFor={field.name} className="text-sm font-medium text-[var(--color-ink)]">
                  {field.label}
                  {field.required && <span className="text-[var(--color-danger-600)]"> *</span>}
                </label>
                <input
                  id={field.name}
                  type={field.type ?? 'text'}
                  {...register(field.name)}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-brand-600)] focus:ring-1 focus:ring-[var(--color-brand-600)]"
                />
                {errors[field.name] && (
                  <p className="text-xs text-[var(--color-danger-600)]">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando…' : 'Continuar'}
          </Button>
        </form>
      </div>
    </div>
  );
}

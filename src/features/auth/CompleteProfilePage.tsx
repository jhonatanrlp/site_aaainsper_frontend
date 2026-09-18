import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormField, Input } from '../../components/forms/controls.js';
import { Button } from '../../components/ui/button.js';
import { ApiError } from '../../lib/api/unwrap.js';
import { useUpdateProfile } from '../users/hooks.js';
import { useAuth } from './AuthContext.js';

const completeProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Informe seu nome completo'),
  cpf: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, '').length === 11, 'CPF deve ter 11 dígitos'),
  rg: z.string().trim().min(1, 'Informe seu RG'),
  birthDate: z.string().min(1, 'Informe sua data de nascimento'),
  course: z.string().trim(),
  instagram: z.string().trim(),
  phone: z.string().trim(),
});

type FormValues = z.infer<typeof completeProfileSchema>;

export function CompleteProfilePage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: { course: '', instagram: '', phone: '' },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateProfile.mutateAsync({
        ...values,
        cpf: values.cpf.replace(/\D/g, ''),
      });
      await refreshProfile();
      toast.success('Perfil completo!');
      navigate('/sistema/atleta', { replace: true });
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Não foi possível salvar seu perfil.',
      );
    }
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

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Nome completo"
            htmlFor="fullName"
            required
            error={errors.fullName?.message}
          >
            <Input id="fullName" autoComplete="name" {...register('fullName')} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="CPF" htmlFor="cpf" required error={errors.cpf?.message}>
              <Input id="cpf" inputMode="numeric" {...register('cpf')} />
            </FormField>
            <FormField label="RG" htmlFor="rg" required error={errors.rg?.message}>
              <Input id="rg" {...register('rg')} />
            </FormField>
            <FormField
              label="Data de nascimento"
              htmlFor="birthDate"
              required
              error={errors.birthDate?.message}
            >
              <Input id="birthDate" type="date" {...register('birthDate')} />
            </FormField>
            <FormField label="Curso" htmlFor="course" error={errors.course?.message}>
              <Input id="course" {...register('course')} />
            </FormField>
            <FormField label="Instagram" htmlFor="instagram" error={errors.instagram?.message}>
              <Input id="instagram" {...register('instagram')} />
            </FormField>
            <FormField label="Telefone" htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
            </FormField>
          </div>

          <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Salvando…' : 'Continuar'}
          </Button>
        </form>
      </div>
    </div>
  );
}

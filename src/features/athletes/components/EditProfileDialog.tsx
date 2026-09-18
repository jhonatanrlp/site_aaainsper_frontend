import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormField, Input } from '../../../components/forms/controls.js';
import { Button } from '../../../components/ui/button.js';
import { Dialog, DialogContent } from '../../../components/ui/dialog.js';
import { ApiError } from '../../../lib/api/unwrap.js';
import { useAuth } from '../../auth/AuthContext.js';
import { useUpdateProfile, type ProfileUpdate } from '../../users/hooks.js';
import type { UserProfile } from '../../users/types.js';

const schema = z.object({
  fullName: z.string().trim().min(1, 'Informe seu nome completo'),
  cpf: z
    .string()
    .trim()
    .refine((value) => value === '' || value.replace(/\D/g, '').length === 11, {
      message: 'CPF deve ter 11 dígitos',
    }),
  rg: z.string().trim().min(1, 'Informe seu RG'),
  birthDate: z.string().min(1, 'Informe sua data de nascimento'),
  course: z.string().trim(),
  instagram: z.string().trim(),
  phone: z.string().trim(),
});

type FormValues = z.infer<typeof schema>;

export function EditProfileDialog({
  profile,
  open,
  onOpenChange,
}: {
  profile: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName ?? '',
      cpf: '',
      rg: profile.rg ?? '',
      birthDate: profile.birthDate ?? '',
      course: profile.course ?? '',
      instagram: profile.instagram ?? '',
      phone: profile.phone ?? '',
    },
  });

  async function onSubmit(values: FormValues) {
    // Only send what actually changed — the API treats this as a partial
    // update, and a blank CPF means "leave it as is".
    const patch: ProfileUpdate = {};
    (Object.keys(dirtyFields) as (keyof FormValues)[]).forEach((key) => {
      if (key === 'cpf') {
        if (values.cpf !== '') patch.cpf = values.cpf.replace(/\D/g, '');
      } else {
        patch[key] = values[key];
      }
    });

    if (Object.keys(patch).length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      await updateProfile.mutateAsync(patch);
      await refreshProfile();
      toast.success('Perfil atualizado.');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Não foi possível salvar.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Editar perfil" description="Altere apenas o que precisar.">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Nome completo"
            htmlFor="fullName"
            required
            error={errors.fullName?.message}
          >
            <Input id="fullName" {...register('fullName')} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="CPF"
              htmlFor="cpf"
              error={errors.cpf?.message}
              hint={
                profile.cpfMask
                  ? `Atual: ${profile.cpfMask}. Deixe em branco para manter.`
                  : undefined
              }
            >
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
              <Input id="phone" type="tel" {...register('phone')} />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

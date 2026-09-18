import { ErrorScreen } from '../../components/feedback/ErrorScreen.js';
import { Skeleton } from '../../components/feedback/Skeleton.js';
import { needsAction } from '../documents/hooks.js';
import { useProfile } from '../users/hooks.js';
import { DocumentsCard } from './components/DocumentsCard.js';
import { ProfileCard } from './components/ProfileCard.js';
import { RegistrationsCard } from './components/RegistrationsCard.js';
import { StatusBanner, SummaryTiles, type SummaryStats } from './components/AthleteSummary.js';
import { TeamsCard } from './components/TeamsCard.js';
import { useAthleteDetail, useMyAthlete } from './hooks.js';

function PageSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Carregando seu perfil">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function AthletePage() {
  const profile = useProfile();
  const me = useMyAthlete();
  const athleteId = me.data?.athlete?.id;
  const detail = useAthleteDetail(athleteId);

  const loading = profile.isPending || me.isPending || (Boolean(athleteId) && detail.isPending);
  if (loading) return <PageSkeleton />;

  if (profile.isError || me.isError || detail.isError || !profile.data) {
    return (
      <ErrorScreen
        message="Não foi possível carregar seu perfil."
        onRetry={() => {
          void profile.refetch();
          void me.refetch();
          void detail.refetch();
        }}
      />
    );
  }

  const data = detail.data;
  const stats: SummaryStats = {
    teams: data?.memberships.length ?? 0,
    pendingRequests: data?.pendingRequests.filter((r) => r.status === 'pending').length ?? 0,
    documentsNeedingAction: data?.documents.filter(needsAction).length ?? 0,
    registrations: data?.competitionRegistrations.length ?? 0,
  };
  const firstName = profile.data.fullName?.split(' ')[0];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">
          {firstName ? `Olá, ${firstName}` : 'Olá'}
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Acompanhe suas equipes, documentos e inscrições.
        </p>
      </div>

      <StatusBanner stats={stats} />
      <SummaryTiles stats={stats} />

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <TeamsCard memberships={data?.memberships ?? []} requests={data?.pendingRequests ?? []} />
          <DocumentsCard documents={data?.documents ?? []} athleteId={data?.athleteId ?? ''} />
        </div>
        <div className="space-y-5">
          <ProfileCard profile={profile.data} />
          <RegistrationsCard registrations={data?.competitionRegistrations ?? []} />
        </div>
      </div>
    </div>
  );
}

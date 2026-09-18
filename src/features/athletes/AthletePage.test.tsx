import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { api, toast } = vi.hoisted(() => ({
  api: { GET: vi.fn(), POST: vi.fn(), PATCH: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock('../../lib/api/client.js', () => ({ api }));
vi.mock('sonner', () => ({ toast }));
vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({ refreshProfile: vi.fn(), signOut: vi.fn(), state: { status: 'loading' } }),
}));

import { AthletePage } from './AthletePage.js';

const profile = {
  id: 'u1',
  email: 'joao@al.insper.edu.br',
  fullName: 'João Silva',
  cpfMask: '***.***.***-45',
  rg: '123',
  birthDate: '2001-03-09',
  course: 'Eng',
  instagram: 'joao',
  phone: '1199',
  role: 'atleta',
  active: true,
};

const doc = (over: Record<string, unknown>) => ({
  id: 'd',
  athleteId: 'a1',
  requiredDocumentId: 'rd',
  status: 'pending',
  storagePath: null,
  uploadedAt: null,
  reviewedAt: null,
  rejectionReason: null,
  expiresAt: null,
  type: 'id_document',
  required: true,
  ...over,
});

const detail = {
  athleteId: 'a1',
  userId: 'u1',
  ...profile,
  memberships: [{ teamId: 't1', teamName: 'Futsal A', modalityId: 'm1', modalityName: 'Futsal' }],
  pendingRequests: [],
  documents: [
    doc({ id: 'd1', requiredDocumentId: 'rd1', type: 'id_document' }),
    doc({
      id: 'd2',
      requiredDocumentId: 'rd2',
      type: 'photo_3x4',
      status: 'rejected',
      storagePath: 'x',
      rejectionReason: 'Foto desfocada',
    }),
    doc({
      id: 'd3',
      requiredDocumentId: 'rd3',
      type: 'enrollment_declaration',
      status: 'approved',
      storagePath: 'y',
    }),
  ],
  competitionRegistrations: [],
};

function respond(data: unknown) {
  return Promise.resolve({ data, response: new Response(null, { status: 200 }) });
}

function mockApi({ athlete }: { athlete: boolean }) {
  api.GET.mockImplementation((path: string) => {
    switch (path) {
      case '/users/me':
        return respond(profile);
      case '/athletes/me':
        return respond(
          athlete
            ? { athlete: { id: 'a1', userId: 'u1' }, teamIds: ['t1'] }
            : { athlete: null, teamIds: [] },
        );
      case '/athletes/{id}':
        return respond(detail);
      case '/competitions':
        return respond([]);
      case '/modalities':
        return respond([
          { id: 'm1', name: 'Futsal', sport: 'futsal', category: 'masculino', active: true },
        ]);
      case '/modalities/{id}/teams':
        return respond([
          { id: 't1', modalityId: 'm1', name: 'Futsal A' },
          { id: 't2', modalityId: 'm1', name: 'Futsal B' },
        ]);
      default:
        return respond(undefined);
    }
  });
}

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AthletePage />
    </QueryClientProvider>,
  );
}

describe('AthletePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('warns about documents that need action and shows their status and rejection reason', async () => {
    mockApi({ athlete: true });
    renderPage();

    expect(await screen.findByText('Olá, João')).toBeInTheDocument();
    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent('Você tem documentos que precisam de ação');
    expect(banner).toHaveTextContent('2 documentos aguardam envio ou reenvio.');
    expect(screen.getByText('Motivo: Foto desfocada')).toBeInTheDocument();
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
    expect(screen.getByText('***.***.***-45')).toBeInTheDocument();
  });

  it('shows guidance instead of empty tables when the user has no athlete record yet', async () => {
    mockApi({ athlete: false });
    renderPage();

    expect(
      await screen.findByText('Você ainda não faz parte de nenhuma equipe'),
    ).toBeInTheDocument();
    expect(screen.getByText('Nenhuma equipe ainda')).toBeInTheDocument();
    expect(screen.getByText('Nenhum documento exigido ainda')).toBeInTheDocument();
    expect(api.GET).not.toHaveBeenCalledWith('/athletes/{id}', expect.anything());
  });

  it('shows an error state with a working retry when the API fails', async () => {
    api.GET.mockImplementation(() =>
      Promise.resolve({
        error: { error: { code: 'X', message: 'boom' } },
        response: new Response(null, { status: 500 }),
      }),
    );
    renderPage();

    expect(await screen.findByText('Não foi possível carregar seu perfil.')).toBeInTheDocument();
    mockApi({ athlete: true });
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByText('Olá, João')).toBeInTheDocument();
  });

  it('rejects an unsupported file client-side without calling the API', async () => {
    mockApi({ athlete: true });
    renderPage();
    await screen.findByText('Olá, João');

    const input = screen.getByLabelText('Selecionar arquivo: Documento de identidade');
    await userEvent.upload(
      input,
      new File(['x'], 'virus.exe', { type: 'application/x-msdownload' }),
      {
        applyAccept: false,
      },
    );

    expect(toast.error).toHaveBeenCalledWith('Envie um arquivo PDF, JPEG ou PNG.');
    expect(api.POST).not.toHaveBeenCalled();
  });

  it('uploads a valid file as multipart to the right athlete/requirement', async () => {
    mockApi({ athlete: true });
    api.POST.mockImplementation(() => respond(doc({ status: 'submitted' })));
    renderPage();
    await screen.findByText('Olá, João');

    const input = screen.getByLabelText('Selecionar arquivo: Documento de identidade');
    await userEvent.upload(input, new File(['%PDF'], 'rg.pdf', { type: 'application/pdf' }));

    await waitFor(() => expect(api.POST).toHaveBeenCalledTimes(1));
    const [path, options] = api.POST.mock.calls[0] as [string, { params: unknown; body: FormData }];
    expect(path).toBe('/athletes/{id}/documents/{requiredDocumentId}');
    expect(options.params).toEqual({ path: { id: 'a1', requiredDocumentId: 'rd1' } });
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body.get('file') as File).name).toBe('rg.pdf');
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it('requests to join a team and disables teams the athlete already belongs to', async () => {
    mockApi({ athlete: true });
    api.POST.mockImplementation(() => respond({ id: 'r1', status: 'pending' }));
    renderPage();
    await screen.findByText('Olá, João');

    await userEvent.click(screen.getByRole('button', { name: /Entrar em uma equipe/ }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.selectOptions(within(dialog).getByLabelText('Modalidade'), 'm1');

    const member = await within(dialog).findByRole('option', { name: /Futsal A/ });
    expect(member).toBeDisabled();

    await userEvent.selectOptions(within(dialog).getByLabelText('Equipe'), 't2');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Enviar pedido' }));

    await waitFor(() =>
      expect(api.POST).toHaveBeenCalledWith('/team-join-requests', { body: { teamId: 't2' } }),
    );
  });
});

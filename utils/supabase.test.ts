import { obterOuCriarSessao } from '../src/background/background';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

const mockFrom = jest.fn(() => ({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { id: 1 } }),
  insert: jest.fn().mockReturnThis(),
}));

(createClient as jest.Mock).mockReturnValue({
  from: mockFrom,
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: { session: { user: { id: 'user123' } } },
      error: null
    }),
  },
});

describe('Supabase - obterOuCriarSessao', () => {
  it('retorna ID da sessão existente', async () => {
    const sessaoId = await obterOuCriarSessao('pesquisa');
    expect(sessaoId).toBe(1);
  });
});
import { createClient } from '@supabase/supabase-js';
import { data } from 'autoprefixer';

const supabaseUrl = 'https://ufgliytwkflmbyykbpvy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2xpeXR3a2ZsbWJ5eWticHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODgyODUsImV4cCI6MjA2MzA2NDI4NX0.5yM9FnpQMmE8JSHVFyYxyoq94u3pOeceVrifUf_6W44'; // truncado por segurança

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const distancia = [
  [1, 0.98, 1, 1, 1, 1, 1, 1, 1, 1],
  [0.01, 1, 0.62, 0.77, 0.92, 0.96, 0.99, 1, 1, 1],
  [0.01, 0.01, 1, 0.95, 0.42, 0.55, 0.63, 0.73, 0.89, 0.95],
  [0.01, 0.01, 0.01, 1, 0.82, 0.31, 0.40, 0.46, 0.52, 0.68],
  [0.01, 0.01, 0.01, 0.01, 1, 0.69, 0.22, 0.29, 0.35, 0.40],
  [0.01, 0.01, 0.01, 0.01, 0.01, 1, 0.54, 0.17, 0.24, 0.29],
  [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 1, 0.47, 0.14, 0.19],
  [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 1, 0.43, 0.12],
  [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 1, 0.41],
  [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 1]
];

let entropiaRelativa = 0.01;
let resultado = 0;
let contarPesquisa = 1;

chrome.storage.onChanged.addListener(async (changes) => {
  for (const chave in changes) {
    const { oldValue, newValue } = changes[chave];
    if (oldValue && newValue) {
      await processarComparacao({ oldValue, newValue });
    }
  }
});

async function processarComparacao(obj: { oldValue: any; newValue: any }) {
  await restaurarSessao();

  const { queryNova, ultimaQuery, chavesOrdenadas } = extrairQueries(obj);
  if (!chavesOrdenadas.length) return;

  const dkg = await obterDKG();
  if (!dkg) return;

  const sessaoId = await obterOuCriarSessao(ultimaQuery || queryNova);
  if (!sessaoId) return;

  if (chavesOrdenadas.length === 1) {
    await processarUnicaQuery(dkg, chavesOrdenadas[0], sessaoId);
  } else {
    await processarMultiplasQueries(dkg, queryNova!, ultimaQuery!, chavesOrdenadas, sessaoId);
  }

  contarPesquisa++;
}

// ===============================
// === Processamento Principal ===
// ===============================

async function processarUnicaQuery(dkg: any, query: string, sessaoId: number) {
  const clicks = dkg[query];
  if (!clicks || clicks.length < 2) {
    console.warn("Clique insuficiente para processar.");
    return;
  }

  for (let i = 1; i < clicks.length; i++) {
    const anterior = clicks[i - 1];
    const atual = clicks[i];

    const r1 = anterior.rank;
    const r2 = atual.rank;
    const link1 = anterior.link;
    const link2 = atual.link;

    const dist = Math.abs(r2 - r1);
    const pi = distancia[dist]?.[r2] ?? 0.01;

    const coefObs = 1; // Para uma única query, pode ser constante ou personalizado

    entropiaRelativa += pi * (Math.log10(coefObs) / pi);
    resultado = (1 - entropiaRelativa) * 0.01;

    await salvarCliques(sessaoId, link1, r1, link2, r2);
    await salvarMetricas(sessaoId, [query, query], coefObs);
  }

  console.log("Múltiplos cliques dentro da mesma busca processados.");
}

async function processarMultiplasQueries(
  dkg: any,
  queryNova: string,
  ultimaQuery: string,
  chaves: string[],
  sessaoId: number
) {
  const { r1, r2, link1, link2 } = obterRanksELinks(dkg, queryNova, ultimaQuery, chaves);
  if (r1 === undefined || r2 === undefined) return;

  const dist = Math.abs(r2 - r1);
  const pi = distancia[dist]?.[r2] ?? 0.01;
  const coefObs = calcularCoeficientesObservacao(chaves);

  entropiaRelativa += pi * (Math.log10(coefObs) / pi);
  resultado = (1 - entropiaRelativa) * 0.01;

  await salvarCliques(sessaoId, link1, r1, link2, r2);
  await salvarMetricas(sessaoId, chaves, coefObs);

  console.log("Processamento de múltiplas buscas concluído.");
}

// ===============================
// === Funções Auxiliares       ===
// ===============================

async function restaurarSessao() {
  return new Promise<void>((resolve) => {
    chrome.storage.local.get(['access_token', 'refresh_token'], async ({ access_token, refresh_token }) => {
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) console.error('Erro ao restaurar sessão:', error.message);
      }
      resolve();
    });
  });
}

function extrairQueries(obj: { oldValue: any; newValue: any }) {
  const chavesNovo = Object.keys(obj.newValue);
  const chavesAntigo = Object.keys(obj.oldValue);
  const horarioAtual = Date.now();

  let queryNova: string | null = null;
  let ultimaQuery: string | null = null;
  let tempoMaisRecente = Infinity;

  for (const chave of chavesNovo) {
    if (!chavesAntigo.includes(chave)) {
      queryNova = chave;
      break;
    }
  }

  for (const chave of chavesAntigo) {
    const horario = parseInt(obj.newValue[chave]?.[0]?.horario ?? '');
    if (!isNaN(horario)) {
      const diff = horarioAtual - horario;
      if (diff < tempoMaisRecente) {
        tempoMaisRecente = diff;
        ultimaQuery = chave;
      }
    }
  }

  const chavesOrdenadas = [...chavesNovo].sort((a, b) => {
    const h1 = parseInt(obj.newValue[a]?.[0]?.horario ?? '0');
    const h2 = parseInt(obj.newValue[b]?.[0]?.horario ?? '0');
    return h2 - h1;
  });

  return { queryNova, ultimaQuery, chavesOrdenadas };
}

async function obterDKG() {
  return new Promise<any>((resolve) => {
    chrome.storage.local.get('dkg', ({ dkg }) => {
      if (!dkg) {
        console.error('DKG não encontrado.');
        resolve(null);
      } else {
        resolve(dkg);
      }
    });
  });
}

function obterRanksELinks(dkg: any, queryNova: string, ultimaQuery: string, chaves: string[]) {
  const nova = dkg[queryNova];
  const antiga = dkg[ultimaQuery];

  if (!nova || !antiga) return {};

  const r1 = chaves.length > 1 ? nova[nova.length - 1]?.rank : antiga[antiga.length - 2]?.rank;
  const r2 = antiga[antiga.length - 1]?.rank;
  const link1 = chaves.length > 1 ? nova[nova.length - 1]?.link : antiga[antiga.length - 2]?.link;
  const link2 = antiga[antiga.length - 1]?.link;

  return { r1, r2, link1, link2 };
}

export async function obterOuCriarSessao(query: string) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session?.user) {
    console.error('Usuário não autenticado.');
    return null;
  }
  const usuarioId = sessionData.session.user.id;

  const { data: sessaoExistente } = await supabase
    .from('sessoes')
    .select('id')
    .eq('usuario_id', usuarioId)
    .eq('busca', query)
    .order('criado_em', { ascending: false })
    .limit(1)
    .single();

  if (sessaoExistente) {
    return sessaoExistente.id;
  }

  const { data: sessaoCriada, error } = await supabase
    .from('sessoes')
    .insert({ usuario_id: usuarioId, busca: query, criado_em: new Date().toISOString() })
    .select()
    .single();

  if (error || !sessaoCriada) {
    console.error('Erro ao criar sessão:', error?.message);
    return null;
  }

  return sessaoCriada.id;
}

export async function salvarCliques(sessaoId: number, link1: string, r1: number, link2: string, r2: number) {
  await supabase.from('cliques').insert([
    { sessao_id: sessaoId, link: link1, rank_organico: r1 },
    { sessao_id: sessaoId, link: link2, rank_organico: r2 }
  ]);
}

export async function salvarMetricas(sessaoId: number, chaves: string[], coefObs: number) {
  const { error } = await supabase.from('metricas_dkg').insert({
    sessao_id: sessaoId,
    jaccard: Jaccard(chaves[0], chaves[1]),
    observacao: coefObs,
    entropia: entropiaRelativa,
    dkg: resultado
  });

  if (error) console.error('Erro ao salvar métricas:', error.message);
}

// ===============================
// === Métricas                  ===
// ===============================

export function Jaccard(q1: string, q2: string): number {
  if (!q1 || !q2) return 0;
  const a = new Set(q1.toLowerCase().split(/\s+/));
  const b = new Set(q2.toLowerCase().split(/\s+/));
  const inter = [...a].filter((p) => b.has(p));
  const uniao = new Set([...a, ...b]);
  return inter.length / uniao.size;
}

export function calcularCoeficientesObservacao(queries: string[]): number {
  if (queries.length < 2) return 0.0001;
  let divisor = 0;
  for (let i = 0; i < queries.length - 1; i += 2) {
    divisor += 1 + Jaccard(queries[i], queries[i + 1]);
  }
  const base = Jaccard(queries[0], queries[1]);
  return divisor === 0 ? 0.0001 : base / divisor;
}
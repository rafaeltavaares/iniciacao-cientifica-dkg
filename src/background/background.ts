import { createClient } from '@supabase/supabase-js';
import { data } from 'autoprefixer';

const supabaseUrl = 'https://ufgliytwkflmbyykbpvy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2xpeXR3a2ZsbWJ5eWticHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODgyODUsImV4cCI6MjA2MzA2NDI4NX0.5yM9FnpQMmE8JSHVFyYxyoq94u3pOeceVrifUf_6W44'; // truncado por segurança


// const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabase = createClient(supabaseUrl, supabaseAnonKey)
let entropiaRelativa = 0.01;
let resultado = 0;
let contarPesquisa = 1;
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

chrome.storage.onChanged.addListener((changes, area) => {
  for (const chave in changes) {
    const { oldValue, newValue } = changes[chave];
    if (oldValue && newValue) {
      compararObjetos({ oldValue, newValue });
    }
  }
});

async function compararObjetos(obj: { newValue: any; oldValue: any }) {

  // Tenta restaurar sessão salva do storage
  chrome.storage.local.get(['access_token', 'refresh_token'], async ({ access_token, refresh_token }) => {

    if (access_token && refresh_token) {
      console.log("estou aqui")
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) console.error('Erro ao restaurar sessão:', error.message);
      else console.log('Sessão restaurada com sucesso');
    }   
  });

  const chavesNovo = Object.keys(obj.newValue);
  const chavesAntigo = Object.keys(obj.oldValue);

  
  let queryNova: string | null = null;
  let ultimaQuery: string | null = null;
  let tempoMaisRecente = Infinity;
  const horarioAtual = Date.now();

  for (const chave of chavesNovo) {
    if (!chavesAntigo.includes(chave)) {
      queryNova = chave;
      break;
    }
  }
  for (const chave of chavesAntigo) {
    const horario = parseInt(obj.newValue[chave]?.[0]?.horario || '');
    if (!isNaN(horario)) {
      const diff = horarioAtual - horario;
      if (diff < tempoMaisRecente) {
        tempoMaisRecente = diff;
        ultimaQuery = chave;
      }
    }
  }
  chavesNovo.sort((a, b) => {
    const h1 = parseInt(obj.newValue[a]?.[0]?.horario || '0');
    const h2 = parseInt(obj.newValue[b]?.[0]?.horario || '0');
    return h2 - h1;
  });

  chrome.storage.local.get('dkg', async (result) => {
    const dkg = result.dkg;
    console.log("================")
    let a = dkg[ultimaQuery].length;
    let b = dkg[queryNova].length; 


    console.log("tamanho chaves novo > ",chavesNovo.length)
    if (!dkg || !chavesNovo[0]) return;

    const tam = dkg[chavesNovo[0]].length;
    if (contarPesquisa > 1) {

      if(chavesNovo.length === 1 && a >= 2){
        const r2 = dkg[chavesNovo[0]][tam - 1].rank;
        const r1 = dkg[chavesNovo[0]][tam - 2].rank;
        const link2 = dkg[chavesNovo[0]][tam - 1].link;
        const link1 = dkg[chavesNovo[0]][tam - 2].link;

        const dist = Math.abs(r2 - r1);
        const pi = distancia[dist][r2];
        const coefObs = calcularCoeficientesObservacao(chavesNovo);
        entropiaRelativa += pi * (Math.log10(coefObs) / pi);
        resultado = (1 - entropiaRelativa) * 0.01;
      }
      if(chavesNovo.length > 1){

        const r2 = dkg[ultimaQuery][a - 1].rank;
        const r1 = dkg[queryNova][b - 1].rank;
        const link2 = dkg[ultimaQuery][a - 1].link;
        const link1 = dkg[queryNova][b - 1].link;

        const dist = Math.abs(r2 - r1);
        const pi = distancia[dist][r2];
        const coefObs = calcularCoeficientesObservacao(chavesNovo);
        entropiaRelativa += pi * (Math.log10(coefObs) / pi);
        resultado = (1 - entropiaRelativa) * 0.01;

        console.log("ultima query > ",ultimaQuery)
        console.log("query nova > ", queryNova)        
        console.log("array ultima query >",dkg[ultimaQuery])
        console.log("array query nova >",dkg[queryNova])
      }

      // Obter sessão do usuário
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user) {
        console.error("Usuário não autenticado.");
        return;
      }

      const usuario_id = sessionData.session.user.id;

      // Verificar se já existe sessão
      const { data: sessaoExistente, error: erroBuscaSessao } = await supabase
        .from('sessoes')
        .select('id')
        .eq('usuario_id', usuario_id)
        .eq('busca', ultimaQuery)
        .order('criado_em', { ascending: false })
        .limit(1)
        .single();

      let sessao_id: number;

      if (erroBuscaSessao || !sessaoExistente) {
        console.log("query nova> ", queryNova)
        console.log("ultima query > ", ultimaQuery)
        if (!ultimaQuery) {
          console.warn("ultimaQuery indefinida, abortando inserção");
          return;
        }
        const { data: sessaoCriada, error: erroSessao } = await supabase
          .from('sessoes')
          .insert([
            {
              usuario_id,
              busca: ultimaQuery,
              criado_em: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (erroSessao || !sessaoCriada) {
          console.error("Erro ao criar sessão:", erroSessao?.message);
          return;
        }

        sessao_id = sessaoCriada.id;
      } else {
        sessao_id = sessaoExistente.id;
      }

      // // Inserir cliques
      // await supabase.from('cliques').insert([
      //   { sessao_id, link: link1, rank_organico: r1 },
      //   { sessao_id, link: link2, rank_organico: r2 }
      // ]);

      // // Inserir métricas
      // const { error: erroMetrica } = await supabase.from('metricas_dkg').insert([
      //   {
      //     sessao_id,
      //     jaccard: Jaccard(chavesNovo[0], chavesNovo[1]),
      //     observacao: coefObs,
      //     entropia: entropiaRelativa,
      //     dkg: resultado
      //   }
      // ]);

      // if (erroMetrica) {
      //   console.error("Erro ao salvar métricas:", erroMetrica.message);
      // } else {
      //   console.log("Métricas salvas com sucesso!");
      // }
    }
  });
  contarPesquisa++
}

function Jaccard(q1: string, q2: string): number {
  if (!q1 || !q2) return 0;
  const a = new Set(q1.toLowerCase().split(/\s+/));
  const b = new Set(q2.toLowerCase().split(/\s+/));
  const inter = [...a].filter(p => b.has(p));
  const uniao = new Set([...a, ...b]);
  return inter.length / uniao.size;
}

function calcularCoeficientesObservacao(queries: string[]): number {
  if (queries.length < 2) return 0.0001;
  let divisor = 0;
  for (let i = 0; i < queries.length - 1; i += 2) {
    divisor += 1 + Jaccard(queries[i], queries[i + 1]);
  }
  const base = Jaccard(queries[0], queries[1]);
  return divisor === 0 ? 0.0001 : base / divisor;
}

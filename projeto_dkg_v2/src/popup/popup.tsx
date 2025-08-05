import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createRoot } from 'react-dom/client';
import './popup.css';

const supabaseUrl ="https://ufgliytwkflmbyykbpvy.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2xpeXR3a2ZsbWJ5eWticHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODgyODUsImV4cCI6MjA2MzA2NDI4NX0.5yM9FnpQMmE8JSHVFyYxyoq94u3pOeceVrifUf_6W44"
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [telaAtual, setTelaAtual] = useState<'home' | 'login' | 'register'>('home');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [user, setUser] = useState<any>(null);
  const [erro, setErro] = useState('');
  
  const [ativo, setAtivo] = useState(false); 
  // Busca o valor salvo no armazenamento ao carregar
  useEffect(() => {
    chrome.storage.local.get("escutando", (r) => {
      if (typeof r.escutando === "boolean") {
        setAtivo(r.escutando);
      }
    });
  }, []);

  // Alterna o estado e atualiza o armazenamento
  const toggleEscuta = () => {
    const novoValor = !ativo;
    setAtivo(novoValor);
    chrome.storage.local.set({ escutando: novoValor });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0].id && novoValor) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content-script.js"]
    });
  }
});
  };


useEffect(() => {
  chrome.storage.local.get(["access_token", "refresh_token"], async (result) => {
    const { access_token, refresh_token } = result;
    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token
      });
      
      if (error) {
        console.error("Erro ao restaurar sessão:", error.message);
      } else {
        setUser(true)
        console.log("Sessão restaurada com sucesso");
      
      }
    }

  });
}, []);

const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email:email,
    password: senha,
  });

  if (data?.session) {
  const access_token = data.session.access_token;
  const refresh_token = data.session.refresh_token;

  // Salve os tokens localmente
  chrome.storage.local.set({
    access_token,
    refresh_token
  });
  console.log("Acesss token: ", access_token)
  console.log("Refresh_token: ", refresh_token)
  }
  if (error) {
    setErro(error.message);
  } else {
    setErro('');
    setUser(data.user);
    
    const userData = {
      id: data.user.id,
      email: data.user.email,
    };

    localStorage.setItem('session', JSON.stringify(userData));
    chrome.storage.local.set({ usuario_logado: userData }, () => {
      console.log("Usuário logado salvo no storage:", userData);
    });

    setTelaAtual('home');
  }
};

const handleRegister = async () => {
  if (senha !== confirmarSenha) {
    setErro('As senhas não coincidem.');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
  });

  if (error) {
    setErro(error.message);
    return;
  }

  // Inserir dados adicionais na tabela 'usuarios'
  const userId = data.user?.id;
  if (userId) {
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert({
        id: userId,
        nome,
        email
      });

    if (insertError) {
      setErro(insertError.message);
      return;
    }
  }

  setErro('');
  alert("Verifique seu e-mail para confirmar o cadastro.");
  setTelaAtual('login');
};


  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('session');
    chrome.storage.local.remove('usuario_logado', () => {
      console.log("Usuário removido do storage.");
    });
    setUser(null);
    setTelaAtual('home');
  };


  return (
    <div className='popup'>
      {telaAtual === 'home' && (
        <>
          <section className='header'>
            <h1>DKG</h1>
            <div>
              {!user ? (
                <button className='headerbtn' onClick={() => setTelaAtual('login')}>Login</button>
              ) : (
                <button className='headerbtn' onClick={handleLogout}>Sair</button>
              )}
            </div>
          </section>
          <div className="switchContainer">
            <span className="status">{ativo ? 'ON' : 'OFF'}</span>
            <label className="switch">
              <input type="checkbox" checked={ativo} onChange={() => toggleEscuta()}/>
              <span className="slider" />
            </label>
          </div>
        </>
      )}

      {telaAtual === 'login' && (
        <section className='login'>
          <div className="loginHeader">
            <button className='headerbtn' onClick={() => setTelaAtual('home')}>← Voltar</button>
          </div>
          <div className="corpoLogin">
            <div className="loginHeader2">
              <h2>Bem-vindo ao DKG</h2>
            </div>
            <div className="campos">    
              <input type="email" className='campo' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className='campo' placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
              <button className='loginbtn' onClick={handleLogin}>Entrar</button>
              {erro && <span className='erro'>{erro}</span>}
              <span className='spanregister'>Não tem uma conta? <a className='register' onClick={()=>{setTelaAtual('register')}}>registre-se agora</a></span>
            </div>
          </div>
        </section>
      )}

      {telaAtual === 'register' && (
        <section className='login'>
          <div className="loginHeader">
            <button className='headerbtn' onClick={() => setTelaAtual('login')}>← Voltar</button>
          </div>
          <div className="corpoLogin">
            <div className="loginHeader2">
              <h2>Crie sua conta</h2>
            </div>
            <div className="campos">    
              <input type="text" className='campo' placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
              <input type="email" className='campo' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className='campo' placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
              <input type="password" className='campo' placeholder="Confirmar senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
              <button className='loginbtn' onClick={handleRegister}>Registrar</button>
              {erro && <span className='erro'>{erro}</span>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

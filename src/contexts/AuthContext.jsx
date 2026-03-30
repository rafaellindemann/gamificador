import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function buscarPerfil(authUserId) {
    const { data, error } = await supabase
      .from("gam_usuarios")
      .select(`
        id,
        auth_user_id,
        nome,
        matricula,
        email,
        tipo,
        ativo,
        ultimo_login_em,
        turma_id,
        gam_turmas (
          id,
          nome,
          codigo
        )
      `)
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }

    return data;
  }

  async function atualizarUltimoLogin(authUserId) {
    const agora = new Date().toISOString();

    const { error } = await supabase
      .from("gam_usuarios")
      .update({ ultimo_login_em: agora })
      .eq("auth_user_id", authUserId);

    if (error) {
      console.error("Erro ao atualizar último login:", error);
    }
  }

  async function carregarTudo(sessaoAtual) {
    setLoading(true);

    const authUser = sessaoAtual?.user ?? null;
    setSession(sessaoAtual);
    setUser(authUser);

    if (!authUser) {
      setPerfil(null);
      setLoading(false);
      return;
    }

    const perfilEncontrado = await buscarPerfil(authUser.id);
    setPerfil(perfilEncontrado);

    if (perfilEncontrado) {
      await atualizarUltimoLogin(authUser.id);
    }

    setLoading(false);
  }


  async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data?.user) {
    const perfilEncontrado = await buscarPerfil(data.user.id);
    setPerfil(perfilEncontrado);
    setUser(data.user);
    setSession(data.session);
  }

  return data;
}

  // async function signIn(email, password) {
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (error) {
  //     throw error;
  //   }

  //   return data;
  // }

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  useEffect(() => {
    let mounted = true;

    async function iniciar() {
      const {
        data: { session: sessaoAtual },
      } = await supabase.auth.getSession();

      if (mounted) {
        await carregarTudo(sessaoAtual);
      }
    }

    iniciar();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, sessaoAtual) => {
      if (mounted) {
        await carregarTudo(sessaoAtual);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    perfil,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    setPerfil,
    recarregarPerfil: async () => {
      if (!user) return;

      const perfilAtualizado = await buscarPerfil(user.id);
      setPerfil(perfilAtualizado);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
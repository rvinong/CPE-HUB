import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const profileFromUser = (user, profile = {}) => ({
  id: user?.id,
  email: user?.email,
  name: profile.name || user?.user_metadata?.name || user?.email || "",
  mobile: profile.mobile || user?.user_metadata?.mobile || "",
  birthday: profile.birthday || user?.user_metadata?.birthday || "",
  isAdmin: Boolean(profile.is_admin),
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = async (authSession) => {
    if (!isSupabaseConfigured || !supabase || !authSession?.user) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setSession(authSession);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authSession.user.id)
      .maybeSingle();

    setUser(profileFromUser(authSession.user, profile || {}));
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      loadProfile(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      loadProfile(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await loadProfile(data.session);
    return data;
  };

  const signup = async ({ name, email, password, mobile, birthday }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, mobile, birthday },
      },
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name,
        mobile,
        birthday: birthday || null,
      });
    }

    if (data.session) {
      await loadProfile(data.session);
    }

    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      session,
      token: session?.access_token || null,
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(session?.user),
      isAdmin: Boolean(user?.isAdmin),
      isSupabaseConfigured,
    }),
    [session, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

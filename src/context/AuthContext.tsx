"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to safely read initial auth state (client-side only)
const getInitialAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  try {
    const stored = localStorage.getItem("auth");
    if (!stored) return { user: null, token: null };

    const parsed = JSON.parse(stored);
    // Basic shape validation
    if (parsed && typeof parsed === "object") {
      return {
        user: parsed.user ?? null,
        token: typeof parsed.token === "string" ? parsed.token : null,
      };
    }
  } catch (err) {
    console.warn("Failed to parse auth from localStorage", err);
  }

  return { user: null, token: null };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthState>(getInitialAuth);
  const [loading, setLoading] = useState(false);

  // Sync state → localStorage (only on meaningful changes)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (auth.user && auth.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth.user, auth.token]);

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let message = "Login failed";
        try {
          const json = JSON.parse(text);
          if (typeof json?.error === "string") message = json.error;
        } catch {
          if (res.status === 401) message = "Invalid email or password";
        }
        return { ok: false, error: message };
      }

      const data = await res.json();

      if (!data?.user?.id || !data?.token) {
        return { ok: false, error: "Invalid response from server" };
      }

      setAuth({
        user: data.user,
        token: data.token,
      });
      return { ok: true };
    } catch (err) {
      console.error("Login error:", err);
      return { ok: false, error: err instanceof Error ? err.message : "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    // localStorage.removeItem is already handled by useEffect
  };

  const value: AuthContextType = {
    ...auth,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
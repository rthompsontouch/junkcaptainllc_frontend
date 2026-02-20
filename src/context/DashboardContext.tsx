"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export interface PotentialCustomer {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  date: string; // probably quote / request date
  images: number;
  imageUrls?: string[]; // URLs of uploaded junk photos (up to 4)
  notes: string;
}

export interface ServiceRecord {
  date: string;
  note: string;
}

export interface ActiveCustomer {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  lastServiceDate: string;
  serviceNote: string;
  serviceHistory?: ServiceRecord[];
  images: number;
  notes: string;
}

export type Customer = PotentialCustomer | ActiveCustomer;

export interface Notification {
  id: string | number;
  customerId: string | number;
  type: "new_quote"; // extend union when more types appear
  read: boolean;
  createdAt: string;
}

interface DashboardState {
  potentialCustomers: PotentialCustomer[];
  activeCustomers: ActiveCustomer[];
  notifications: Notification[];
  loadingCustomers: boolean;
  loadingNotifications: boolean;
  error: string | null; // general or last error
}

interface DashboardContextType extends DashboardState {
  unreadNotifications: Notification[];
  fetchCustomers: () => Promise<void>;
  createCustomer: (data: Partial<PotentialCustomer>) => Promise<void>;
  updateCustomer: (
    id: string | number,
    data: Partial<Customer>,
    type: "potential" | "active"
  ) => Promise<void>;
  deleteCustomer: (id: string | number, type: "potential" | "active") => Promise<void>;
  convertToCustomer: (id: string | number) => Promise<void>;
  addServiceRecord: (customerId: string | number, date: string, note: string) => Promise<ActiveCustomer | void>;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string | number) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<DashboardState>({
    potentialCustomers: [],
    activeCustomers: [],
    notifications: [],
    loadingCustomers: false,
    loadingNotifications: false,
    error: null,
  });

  const fetchCustomers = useCallback(async () => {
    if (!token) return; // skip if not authenticated

    setState((prev) => ({ ...prev, loadingCustomers: true, error: null }));

    try {
      const [potRes, actRes] = await Promise.all([
        fetch("/api/customers?type=potential", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/customers?type=active", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!potRes.ok || !actRes.ok) {
        const status = potRes.ok ? actRes.status : potRes.status;
        if (status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        if (status >= 500) throw new Error("Server error. Is the backend running? (npm run dev:backend)");
        throw new Error("Failed to load customers");
      }

      const [potential, active] = await Promise.all([
        potRes.json(),
        actRes.json(),
      ]);

      setState((prev) => ({
        ...prev,
        potentialCustomers: potential,
        activeCustomers: active,
        loadingCustomers: false,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const message =
        /fetch|network|ECONNREFUSED/i.test(msg)
          ? "Backend not reachable. Start it with: npm run dev:backend"
          : msg;
      setState((prev) => ({
        ...prev,
        loadingCustomers: false,
        error: `Customers: ${message}`,
      }));
      console.error("Fetch customers failed:", err);
    }
  }, [token, logout, router]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    setState((prev) => ({ ...prev, loadingNotifications: true, error: null }));

    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        if (res.status >= 500) throw new Error("Server error. Is the backend running? (npm run dev:backend)");
        throw new Error("Failed to load notifications");
      }

      const data = await res.json();
      setState((prev) => ({
        ...prev,
        notifications: data,
        loadingNotifications: false,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const message =
        /fetch|network|ECONNREFUSED/i.test(msg)
          ? "Backend not reachable. Start it with: npm run dev:backend"
          : msg;
      setState((prev) => ({
        ...prev,
        loadingNotifications: false,
        error: `Notifications: ${message}`,
      }));
      console.error("Fetch notifications failed:", err);
    }
  }, [token, logout, router]);

  // Initial data load
  useEffect(() => {
    if (token) {
      fetchCustomers();
      fetchNotifications();
    }
  }, [token, fetchCustomers, fetchNotifications]);

  // ────────────────────────────────────────────────
  // Mutations ───────────────────────────────────────
  // ────────────────────────────────────────────────

  const createCustomer = async (data: Partial<PotentialCustomer>) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        const errText = await res.text().catch(() => "Create failed");
        throw new Error(errText);
      }

      await fetchCustomers(); // refresh
    } catch (err) {
      console.error("Create customer failed:", err);
      throw err; // let UI catch & show toast/alert
    }
  };

  const updateCustomer = async (
    id: string | number,
    data: Partial<Customer>,
    type: "potential" | "active"
  ) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, type, ...data }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        throw new Error("Update failed");
      }

      await fetchCustomers();
    } catch (err) {
      console.error("Update customer failed:", err);
      throw err;
    }
  };

  const deleteCustomer = async (id: string | number, type: "potential" | "active") => {
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch("/api/customers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, type }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        throw new Error("Delete failed");
      }

      await fetchCustomers();
    } catch (err) {
      console.error("Delete customer failed:", err);
      throw err;
    }
  };

  const convertToCustomer = async (id: string | number) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "convert", id }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        throw new Error("Conversion failed");
      }

      await fetchCustomers();
    } catch (err) {
      console.error("Convert failed:", err);
      throw err;
    }
  };

  const addServiceRecord = async (customerId: string | number, date: string, note: string) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "addService", id: customerId, date, note }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        throw new Error("Failed to add service");
      }

      const updated = await res.json();
      await fetchCustomers();
      return updated;
    } catch (err) {
      console.error("Add service failed:", err);
      throw err;
    }
  };

  const markNotificationRead = async (id: string | number) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch("/api/notifications/read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        throw new Error("Mark read failed");
      }

      await fetchNotifications();
    } catch (err) {
      console.error("Mark read failed:", err);
      throw err;
    }
  };

  const unreadNotifications = state.notifications.filter((n) => !n.read);

  const value: DashboardContextType = {
    ...state,
    unreadNotifications,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    convertToCustomer,
    addServiceRecord,
    fetchNotifications,
    markNotificationRead,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};
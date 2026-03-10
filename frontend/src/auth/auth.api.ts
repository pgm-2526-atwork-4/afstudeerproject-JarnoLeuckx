const API_URL = import.meta.env.VITE_API_URL;
const LAST_ACTIVE_AT_KEY = "lastActiveAt";
const AUTH_CHANGED_EVENT = "auth:changed";
const INACTIVITY_TIMEOUT_MS = 4 * 60 * 60 * 1000;

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  phone?: string;
  address?: string;
  vaph_number?: string;
  email_notifications_enabled?: boolean | null;
  pvb_contract_signed_at?: string | null;
  pvb_contract_signer_name?: string | null;
  role: "driver" | "customer" | "admin";
  approval_status?: "pending" | "approved" | "rejected";
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

type ProfileResponse = {
  message: string;
  user: User;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || "Login mislukt.");
  }

  return data as LoginResponse;
}

export async function register(payload: {
  name: string;
  email: string;
  role: "customer" | "driver";
  phone?: string;
  address?: string;
  vaph_number?: string;
  password: string;
  password_confirmation: string;
}): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    if (data.errors) {
      const firstError = Object.values<string[]>(data.errors)[0]?.[0];
      throw new Error(firstError || data.message || "Registratie mislukt.");
    }

    throw new Error(data.message || "Registratie mislukt.");
  }

  return data as RegisterResponse;
}

export async function checkEmailExists(
  email: string,
): Promise<{ exists: boolean }> {
  const res = await fetch(`${API_URL}/email-exists`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || "E-mailcontrole mislukt.");
  }

  return { exists: Boolean(data.exists) };
}

export function saveAuth(token: string, user: User) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  touchActivity();
  notifyAuthChanged();
}

export function setCurrentUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
  notifyAuthChanged();
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem(LAST_ACTIVE_AT_KEY);
  notifyAuthChanged();
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    clearAuth();
    return null;
  }
}

export function touchActivity() {
  localStorage.setItem(LAST_ACTIVE_AT_KEY, String(Date.now()));
}

export function isSessionExpired(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const lastActiveAt = Number(localStorage.getItem(LAST_ACTIVE_AT_KEY) ?? 0);
  if (!lastActiveAt) return false;

  return Date.now() - lastActiveAt > INACTIVITY_TIMEOUT_MS;
}

export function enforceActiveSession(): boolean {
  if (isSessionExpired()) {
    clearAuth();
    return false;
  }

  return true;
}

export async function logout() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // noop
    }
  }

  clearAuth();
}

export async function updateMe(payload: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  vaph_number?: string;
  email_notifications_enabled?: boolean | null;
}): Promise<ProfileResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Niet ingelogd.");
  }

  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    if (data.errors) {
      const firstError = Object.values<string[]>(data.errors)[0]?.[0];
      throw new Error(
        firstError || data.message || "Profiel bijwerken mislukt.",
      );
    }

    throw new Error(data.message || "Profiel bijwerken mislukt.");
  }

  return data as ProfileResponse;
}

export async function updateNotificationPreferences(
  emailNotificationsEnabled: boolean,
): Promise<ProfileResponse> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Niet ingelogd.");
  }

  const res = await fetch(`${API_URL}/me/notification-preferences`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email_notifications_enabled: emailNotificationsEnabled,
    }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    if (data.errors) {
      const firstError = Object.values<string[]>(data.errors)[0]?.[0];
      throw new Error(
        firstError || data.message || "Meldingsvoorkeur bijwerken mislukt.",
      );
    }

    throw new Error(data.message || "Meldingsvoorkeur bijwerken mislukt.");
  }

  return data as ProfileResponse;
}

export async function deleteMe(password: string): Promise<{ message: string }> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Niet ingelogd.");
  }

  const res = await fetch(`${API_URL}/me`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    if (data.errors) {
      const firstError = Object.values<string[]>(data.errors)[0]?.[0];
      throw new Error(
        firstError || data.message || "Account verwijderen mislukt.",
      );
    }

    throw new Error(data.message || "Account verwijderen mislukt.");
  }

  return { message: data.message || "Je account is verwijderd." };
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function onAuthChanged(listener: () => void) {
  const handler = () => listener();
  window.addEventListener(AUTH_CHANGED_EVENT, handler);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, handler);
  };
}

export { login as loginDriver, register as registerDriver };

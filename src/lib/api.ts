const AUTH_URL = "https://functions.poehali.dev/5cd52467-27fa-472a-bdbb-3e1dbb8a8c4a";
const UPLOAD_URL = "https://functions.poehali.dev/12adb36e-3485-4427-97a0-dcba84d159c8";
const TOKEN_KEY = "spark_session_token";
const USER_KEY = "spark_cached_user";

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Кешируем юзера чтобы не было мигания при перезагрузке
export function getCachedUser(): Record<string, unknown> | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setCachedUser(user: Record<string, unknown>) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function call(body: object, withToken = false) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (withToken) headers["X-Session-Token"] = getToken();
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export const api = {
  register: (params: {
    email: string;
    password: string;
    name: string;
    age?: number;
    city?: string;
    bio?: string;
    interests?: string[];
  }) => call({ action: "register", ...params }),

  login: (email: string, password: string) =>
    call({ action: "login", email, password }),

  me: () => call({ action: "me" }, true),

  logout: () => call({ action: "logout" }, true),

  updateProfile: (params: {
    name?: string;
    age?: number;
    city?: string;
    bio?: string;
    interests?: string[];
  }) => call({ action: "update_profile", ...params }, true),

  uploadAvatar: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-Token": getToken(),
          },
          body: JSON.stringify({ image: base64, content_type: file.type }),
        });
        const data = await res.json();
        if (!res.ok) return reject(new Error(data.error || "Ошибка загрузки"));
        resolve(data.avatar_url);
      };
      reader.onerror = () => reject(new Error("Ошибка чтения файла"));
      reader.readAsDataURL(file);
    });
  },
};

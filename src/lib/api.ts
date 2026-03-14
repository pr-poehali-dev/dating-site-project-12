const AUTH_URL = "https://functions.poehali.dev/5cd52467-27fa-472a-bdbb-3e1dbb8a8c4a";
const TOKEN_KEY = "spark_session_token";

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
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
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export const TOKEN_STORAGE_KEY = "pipelytcs_token";
export const USER_STORAGE_KEY = "pipelytcs_user";

type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getStoredUser = <T>() => {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return user ? (JSON.parse(user) as T) : null;
};

export const setStoredAuth = (token: string, user: unknown) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const token = getStoredToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (options.auth !== false && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;

  if (options.body instanceof FormData) {
    requestBody = options.body;
  } else if (options.body !== undefined) {
    requestBody = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: requestBody,
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
};
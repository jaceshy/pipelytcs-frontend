import { apiRequest } from "./api";

export type UserRole = "admin" | "team";

export interface AuthUser {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  status: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  fullName?: string;
  nama?: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = async (data: RegisterPayload) => {
  return apiRequest<AuthResponse>("/register", {
    method: "POST",
    auth: false,
    body: {
      nama: data.nama || data.fullName,
      email: data.email,
      password: data.password,
    },
  });
};

export const login = async (data: LoginPayload) => {
  return apiRequest<AuthResponse>("/login", {
    method: "POST",
    auth: false,
    body: data,
  });
};

export const logout = async () => {
  return apiRequest<{ message: string }>("/logout", {
    method: "POST",
  });
};
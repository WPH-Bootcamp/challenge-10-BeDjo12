import { api } from "@/lib/api";
import {
  loginpayload,
  LoginResponse,
  Registerpayload,
  RegisterResponse,
} from "@/types/blog";

export async function loginUser(payload: loginpayload) {
  const res = await api.post<LoginResponse>("auth/login", payload);
  return res.data;
}

export async function registerUser(payload: Registerpayload) {
  const res = await api.post<RegisterResponse>("auth/register", payload);
  return res.data;
}

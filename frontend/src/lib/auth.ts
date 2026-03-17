import Cookies from "js-cookie";
import { User } from "@/types";

export const setAuth = (token: string, user: User) => {
  Cookies.set("token", token, { expires: 1 });
  Cookies.set("user", JSON.stringify(user), { expires: 1 });
};

export const clearAuth = () => {
  Cookies.remove("token");
  Cookies.remove("user");
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const raw = Cookies.get("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get("token");
};

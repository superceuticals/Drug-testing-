import type { TechnicianInfo } from "@/lib/api";

export const STORAGE_KEYS = {
  token: "sc_api_token",
  url: "sc_api_url",
  technician: "sc_technician",
} as const;

export const DEFAULT_API_URL = "https://qa.sc.superceuticals.in";

interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/** Decode a JWT payload without verifying the signature. Returns null if malformed. */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * A token is valid when it exists, is a well-formed JWT, and — if it carries an
 * `exp` claim — has not yet expired. Tokens without an `exp` claim are treated as
 * non-expiring (the API decides validity server-side via 401).
 */
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token || !token.trim()) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  if (typeof payload.exp === "number") {
    return payload.exp * 1000 > Date.now();
  }
  return true;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function getStoredTechnician(): TechnicianInfo | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.technician);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TechnicianInfo;
  } catch {
    return null;
  }
}

export function getStoredBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_API_URL;
  return localStorage.getItem(STORAGE_KEYS.url) ?? DEFAULT_API_URL;
}

export function storeAuth(token: string, technician: TechnicianInfo | null, baseUrl: string): void {
  localStorage.setItem(STORAGE_KEYS.token, token.trim());
  localStorage.setItem(STORAGE_KEYS.url, baseUrl.trim().replace(/\/$/, ""));
  if (technician) {
    localStorage.setItem(STORAGE_KEYS.technician, JSON.stringify(technician));
  }
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.technician);
}

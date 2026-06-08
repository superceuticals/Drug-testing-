"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, LogIn, Loader2, AlertTriangle } from "lucide-react";
import { login, type LoginCredentials } from "@/lib/api";
import {
  isTokenValid,
  getStoredToken,
  getStoredBaseUrl,
  storeAuth,
  DEFAULT_API_URL,
} from "@/lib/auth";

const PRESETS = {
  local: "http://localhost:2001",
  qa: "https://qa.sc.superceuticals.in",
  prod: "https://api.superceuticals.in",
};

const MACHINE_ID = "MC0001";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [baseUrl, setBaseUrl] = useState(DEFAULT_API_URL);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    LabTechnicianID: "",
    MachineID: MACHINE_ID,
    password: "",
  });
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in with a valid token, skip login.
  useEffect(() => {
    setBaseUrl(getStoredBaseUrl());
    if (isTokenValid(getStoredToken())) {
      router.replace("/tester");
    } else {
      setChecking(false);
    }
  }, [router]);

  const setCred = (field: keyof LoginCredentials, value: string) =>
    setCredentials((prev) => ({ ...prev, [field]: value }));

  const handleLogin = async () => {
    if (!credentials.LabTechnicianID.trim() || !credentials.password) {
      setError("Enter LabTechnicianID and password.");
      return;
    }
    setLoggingIn(true);
    setError(null);
    const result = await login(baseUrl, {
      LabTechnicianID: credentials.LabTechnicianID.trim(),
      MachineID: MACHINE_ID,
      password: credentials.password,
    });
    setLoggingIn(false);

    if (result.error || !result.token) {
      setError(result.error ?? "Login failed — no token returned.");
      return;
    }

    storeAuth(result.token, result.info, baseUrl);
    router.replace("/tester");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-blue-600" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <Zap size={22} className="text-blue-600" />
            <span className="font-semibold text-zinc-900 text-lg">SC API Tester</span>
          </div>
          <p className="text-sm text-zinc-500">Technician login</p>
        </div>

        <div className="space-y-4">
          {/* Environment */}
          {/* <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Environment
            </label>
            <div className="flex gap-1">
              {(["local", "qa", "prod"] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBaseUrl(PRESETS[preset])}
                  className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    baseUrl === PRESETS[preset]
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </button>
              ))}
            </div>
          </div> */}

          {/* Credentials */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Testing ID
            </label>
            <input
              type="text"
              value={credentials.LabTechnicianID}
              onChange={(e) => setCred("LabTechnicianID", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50"
              style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
              placeholder="TECH634122"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCred("password", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50"
              style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loggingIn}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loggingIn ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Logging in…
              </>
            ) : (
              <>
                <LogIn size={15} /> Login
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

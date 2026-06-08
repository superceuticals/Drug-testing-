export async function callApi(
  url: string,
  token: string
): Promise<{
  data: unknown;
  status: number | null;
  statusText: string;
  timing: number;
  error: string | null;
}> {
  const t0 = performance.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return {
      data,
      status: res.status,
      statusText: res.statusText,
      timing: Math.round(performance.now() - t0),
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      status: null,
      statusText: "",
      timing: Math.round(performance.now() - t0),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export interface LoginCredentials {
  LabTechnicianID: string;
  MachineID: string;
  password: string;
}

export interface TechnicianInfo {
  LabTechnicianID?: string;
  CentreID?: string;
  Name?: string;
  MachineID?: string;
  Address?: string;
  designation?: string;
}

export async function login(
  baseUrl: string,
  credentials: LoginCredentials
): Promise<{
  token: string | null;
  info: TechnicianInfo | null;
  data: unknown;
  error: string | null;
}> {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  try {
    const res = await fetch("https://api.superceuticals.in/technicians/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    const body = (data ?? {}) as Record<string, unknown>;
    if (!res.ok || body.error) {
      return {
        token: null,
        info: null,
        data,
        error: (body.message as string) || `Login failed (${res.status})`,
      };
    }
    return {
      token: (body.token as string) ?? null,
      info: {
        LabTechnicianID: body.LabTechnicianID as string,
        CentreID: body.CentreID as string,
        Name: body.Name as string,
        MachineID: body.MachineID as string,
        Address: body.Address as string,
        designation: body.designation as string,
      },
      data,
      error: null,
    };
  } catch (err) {
    return {
      token: null,
      info: null,
      data: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function buildUrl(
  baseUrl: string,
  endpoint: string,
  params: Record<string, string>,
  pathParam?: string
): string {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  // pathParam is appended as a path segment, e.g. /labTestSuggestion/getNew/{query}
  const fullEndpoint = pathParam ? `${endpoint}/${encodeURIComponent(pathParam)}` : endpoint;
  const url = new URL(fullEndpoint, base + "/");
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  return url.toString();
}

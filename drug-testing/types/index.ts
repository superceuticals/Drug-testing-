export interface TabState {
  query: string;
  disease: string;
  doctorId: string;
  force: boolean;
  loading: boolean;
  response: unknown;
  status: number | null;
  statusText: string;
  timing: number | null;
  error: string | null;
}

export function initialTabState(): TabState {
  return {
    query: "",
    disease: "",
    doctorId: "",
    force: false,
    loading: false,
    response: undefined,
    status: null,
    statusText: "",
    timing: null,
    error: null,
  };
}

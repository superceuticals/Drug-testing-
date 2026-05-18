export interface TabState {
  query: string;
  disease: string;
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
    loading: false,
    response: undefined,
    status: null,
    statusText: "",
    timing: null,
    error: null,
  };
}

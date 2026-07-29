export async function apiFetch<T = any>(path: string, options: RequestInit = {}) {
  const baseUrl = "http://127.0.0.1:8000/api";
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

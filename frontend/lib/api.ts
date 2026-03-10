import type { AdSpot, CreateAdSpotRequest } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore JSON parse error — keep the default message
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/** Returns ALL adspots (active + inactive) as a flat array. Admin use only. */
export function getAllAdSpots(placement?: string): Promise<AdSpot[]> {
  const params = placement ? `?placement=${encodeURIComponent(placement)}` : "";
  return request<AdSpot[]>(`/adspots/all${params}`);
}

/** Returns a single AdSpot by id. */
export function getAdSpot(id: string): Promise<AdSpot> {
  return request<AdSpot>(`/adspots/${encodeURIComponent(id)}`);
}

/** Creates a new AdSpot. */
export function createAdSpot(body: CreateAdSpotRequest): Promise<AdSpot> {
  return request<AdSpot>("/adspots", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** Marks an AdSpot as inactive. */
export function deactivateAdSpot(id: string): Promise<AdSpot> {
  return request<AdSpot>(`/adspots/${encodeURIComponent(id)}/deactivate`, {
    method: "POST",
  });
}

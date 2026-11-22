// Funnel & Multi-Touch Attribution API Service
const API_BASE = 'http://localhost:8000';

export async function fetchFunnel() {
  try {
    const res = await fetch(`${API_BASE}/api/funnel`);
    if (!res.ok) throw new Error('Funnel fetch failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchAttribution() {
  try {
    const res = await fetch(`${API_BASE}/api/attribution`);
    if (!res.ok) throw new Error('Attribution fetch failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchDropOffs() {
  try {
    const res = await fetch(`${API_BASE}/api/drop-offs`);
    if (!res.ok) throw new Error('Drop-offs fetch failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

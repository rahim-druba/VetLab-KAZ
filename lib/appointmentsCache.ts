/**
 * Client-side cache for appointments so they show on the dashboard
 * even when Supabase RLS blocks SELECT. Data is merged with Supabase results.
 */

const CACHE_KEY = 'vetlab_appointments_cache';

export type CachedAppointment = {
  id: string;
  full_name: string;
  contact_phone: string;
  department: string;
  created_at: string;
  notes?: string | null;
  owner_name?: string | null;
  pet_name?: string | null;
  pet_details?: string | null;
};

function storageKey(userId: string): string {
  return `${CACHE_KEY}_${userId}`;
}

export function getCachedAppointments(userId: string): CachedAppointment[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const list = JSON.parse(raw) as CachedAppointment[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function addAppointmentToCache(userId: string, appointment: Omit<CachedAppointment, 'id' | 'created_at'> & { created_at?: string }): void {
  const list = getCachedAppointments(userId);
  const entry: CachedAppointment = {
    id: crypto.randomUUID(),
    created_at: appointment.created_at ?? new Date().toISOString(),
    full_name: appointment.full_name,
    contact_phone: appointment.contact_phone,
    department: appointment.department,
    notes: appointment.notes ?? null,
    owner_name: appointment.owner_name ?? appointment.full_name,
    pet_name: appointment.pet_name ?? null,
    pet_details: appointment.pet_details ?? null,
  };
  list.unshift(entry);
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(list));
  } catch {
    // storage full or private mode
  }
}

export function mergeAndSort(
  fromSupabase: CachedAppointment[],
  fromCache: CachedAppointment[]
): CachedAppointment[] {
  const seen = new Set<string>();
  const combined: CachedAppointment[] = [];
  for (const a of fromSupabase) {
    const key = `${a.created_at}|${a.full_name}|${a.contact_phone}`;
    if (seen.has(key)) continue;
    seen.add(key);
    combined.push(a);
  }
  for (const a of fromCache) {
    const key = `${a.created_at}|${a.full_name}|${a.contact_phone}`;
    if (seen.has(key)) continue;
    seen.add(key);
    combined.push(a);
  }
  combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return combined.slice(0, 50);
}

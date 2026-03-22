export type ExperienceType = "proposal" | "puzzle" | "birthday" | "valentine";

export type SurpriseRecord = {
  id: string;
  type: ExperienceType;
  name?: string;
  age?: number;
  cakeType?: string;
  question?: string;
  recipient?: "her" | "him";
  yesText?: string;
  noText?: string;
  message: string;
  photoUrl: string | null;
  createdAt: string;
};

const STORAGE_KEY = "sendwishes:surprises:v1";

export function generateUuid() {
  const cryptoObj: unknown =
    typeof globalThis !== "undefined" && "crypto" in globalThis
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).crypto
      : undefined;

  if (cryptoObj && typeof cryptoObj === "object" && "randomUUID" in cryptoObj) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (cryptoObj as any).randomUUID() as string;
  }

  // Fallback UUID v4-ish (for older environments)
  const bytes = new Uint8Array(16);
  if (
    cryptoObj &&
    typeof cryptoObj === "object" &&
    "getRandomValues" in cryptoObj
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cryptoObj as any).getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function readAll(): Record<string, SurpriseRecord> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as Record<string, SurpriseRecord>;
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, SurpriseRecord>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function saveSurprise(input: Omit<SurpriseRecord, "createdAt">) {
  const record: SurpriseRecord = {
    ...input,
    createdAt: new Date().toISOString(),
  };

  const all = readAll();
  all[record.id] = record;
  writeAll(all);

  return record;
}

export function getSurprise(id: string) {
  const all = readAll();
  return all[id] ?? null;
}

export function buildExperienceUrl(type: ExperienceType, id: string) {
  const path = `/${type}/${id}`;
  if (typeof window === "undefined") return path;
  const origin = window.location?.origin || "http://localhost:3000";
  return `${origin}${path}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/*
============================================================
Supabase integration (COMMENTED OUT — enable when ready)
============================================================

1) Install:
   npm i @supabase/supabase-js

2) Add env vars:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=

3) Example table (Postgres):
   create table surprises (
     id uuid primary key,
     type text not null,
     message text not null,
     photo_url text,
     created_at timestamptz default now()
   );

4) Client code:

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveSurpriseSupabase(record: SurpriseRecord) {
  const { error } = await supabase.from("surprises").insert({
    id: record.id,
    type: record.type,
    message: record.message,
    photo_url: record.photoUrl,
  });
  if (error) throw error;
}

export async function getSurpriseSupabase(id: string) {
  const { data, error } = await supabase
    .from("surprises")
    .select("id,type,message,photo_url,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    type: data.type,
    message: data.message,
    photoUrl: data.photo_url,
    createdAt: data.created_at,
  } as SurpriseRecord;
}

============================================================
Firebase integration (COMMENTED OUT — enable when ready)
============================================================

1) Install:
   npm i firebase

2) Initialize Firebase app + Firestore.

3) Example doc shape:
   surprises/{id} => { type, message, photoUrl, createdAt }

*/

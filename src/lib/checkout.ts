import { generateUuid, saveSurprise, type ExperienceType } from "@/lib/surprises";

export type PendingCheckout = {
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
  returnTo: string;
};

const PENDING_KEY = "sendwishes:pending-checkout:v1";

export function savePendingCheckout(pending: PendingCheckout) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function readPendingCheckout(): PendingCheckout | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as PendingCheckout;
  } catch {
    return null;
  }
}

export function clearPendingCheckout() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PENDING_KEY);
}

export function completeCheckout(pending: PendingCheckout) {
  const id = generateUuid();
  saveSurprise({
    id,
    type: pending.type,
    name: pending.name,
    age: pending.age,
    cakeType: pending.cakeType,
    question: pending.question,
    recipient: pending.recipient,
    yesText: pending.yesText,
    noText: pending.noText,
    message: pending.message,
    photoUrl: pending.photoUrl,
  });
  clearPendingCheckout();
  return id;
}

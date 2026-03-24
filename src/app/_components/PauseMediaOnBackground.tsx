"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __sendwishesMedia?: Set<HTMLMediaElement>;
  }
}

export function registerSendwishesMedia(el: HTMLMediaElement) {
  if (typeof window === "undefined") return;
  if (!window.__sendwishesMedia) window.__sendwishesMedia = new Set();
  window.__sendwishesMedia.add(el);
}

export function unregisterSendwishesMedia(el: HTMLMediaElement) {
  if (typeof window === "undefined") return;
  window.__sendwishesMedia?.delete(el);
}

function pauseMediaEl(el: HTMLMediaElement) {
  try {
    el.pause();
  } catch {
    // ignore
  }
  try {
    el.currentTime = 0;
  } catch {
    // ignore
  }
}

export function PauseMediaOnBackground() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const pauseAllMedia = () => {
      try {
        const els = document.querySelectorAll("audio,video");
        for (const node of Array.from(els)) {
          pauseMediaEl(node as HTMLMediaElement);
        }
      } catch {
        // ignore
      }

      const registry = window.__sendwishesMedia;
      if (registry) {
        for (const el of registry) pauseMediaEl(el);
      }

      // Best-effort: reflect the paused state to the OS media controls.
      try {
        if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any).mediaSession.playbackState = "paused";
        }
      } catch {
        // ignore
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") pauseAllMedia();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", pauseAllMedia);
    window.addEventListener("blur", pauseAllMedia);
    window.addEventListener("beforeunload", pauseAllMedia);

    // Page Lifecycle API (mobile browsers sometimes freeze pages).
    // Typescript lib.dom doesn't include these everywhere, so we cast.
    document.addEventListener("freeze" as unknown as "visibilitychange", pauseAllMedia);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", pauseAllMedia);
      window.removeEventListener("blur", pauseAllMedia);
      window.removeEventListener("beforeunload", pauseAllMedia);
      document.removeEventListener("freeze" as unknown as "visibilitychange", pauseAllMedia);
    };
  }, []);

  return null;
}
"use client";

import { useEffect } from "react";

declare global {
  type SendwishesMediaRegistry = {
    mediaElements: Set<HTMLMediaElement>;
    audioContexts: Set<AudioContext>;
  };

  interface Window {
    __sendwishesMedia?: SendwishesMediaRegistry;
  }
}

const mediaElementCleanup = new WeakMap<HTMLMediaElement, () => void>();
const audioContextCleanup = new WeakMap<AudioContext, () => void>();

function ensureRegistry(): SendwishesMediaRegistry {
  if (typeof window === "undefined") {
    return { mediaElements: new Set(), audioContexts: new Set() };
  }
  if (!window.__sendwishesMedia) {
    window.__sendwishesMedia = {
      mediaElements: new Set<HTMLMediaElement>(),
      audioContexts: new Set<AudioContext>(),
    };
  }
  return window.__sendwishesMedia;
}

function setMediaSessionPaused() {
  try {
    if (typeof navigator === "undefined") return;
    if (!("mediaSession" in navigator)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).mediaSession.playbackState = "paused";
  } catch {
    // ignore
  }
}

function muteFirstPause(
  el: HTMLMediaElement,
  opts?: {
    resetTime?: boolean;
    restoreMuted?: boolean;
  }
) {
  let prevMuted: boolean | null = null;
  try {
    // Mute first: faster hardware-level instruction on mobile.
    prevMuted = el.muted;
    el.muted = true;
  } catch {
    // ignore
  }

  try {
    el.pause();
  } catch {
    // ignore
  }

  if (opts?.resetTime === false) return;
  try {
    el.currentTime = 0;
  } catch {
    // ignore
  }

  // If this was a temporary safety mute (blur/background), restore the prior
  // muted state once we're confident the element is actually paused.
  if (opts?.restoreMuted === false) return;
  if (prevMuted === null) return;

  try {
    window.setTimeout(() => {
      try {
        if (!el.paused) return;
        el.muted = prevMuted as boolean;
      } catch {
        // ignore
      }
    }, 250);
  } catch {
    // ignore
  }
}

function suspendAudioContext(ctx: AudioContext) {
  try {
    // Best-effort: we intentionally do not await.
    void ctx.suspend();
  } catch {
    // ignore
  }
}

export function registerSendwishesMedia(el: HTMLMediaElement) {
  if (typeof window === "undefined") return;
  const registry = ensureRegistry();
  registry.mediaElements.add(el);

  // Attach per-element pagehide/blur listeners for mobile reliability.
  if (!mediaElementCleanup.has(el)) {
    const silence = () => {
      muteFirstPause(el);
      setMediaSessionPaused();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") silence();
    };

    window.addEventListener("pagehide", silence, { capture: true });
    window.addEventListener("blur", silence, { capture: true });
    window.addEventListener("beforeunload", silence, { capture: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { capture: true });
    document.addEventListener("freeze" as unknown as "visibilitychange", silence, { capture: true });

    mediaElementCleanup.set(el, () => {
      window.removeEventListener("pagehide", silence, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("blur", silence, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("beforeunload", silence, { capture: true } as AddEventListenerOptions);
      document.removeEventListener("visibilitychange", onVisibilityChange, { capture: true } as AddEventListenerOptions);
      document.removeEventListener(
        "freeze" as unknown as "visibilitychange",
        silence,
        { capture: true } as AddEventListenerOptions
      );
    });
  }
}

export function unregisterSendwishesMedia(el: HTMLMediaElement) {
  if (typeof window === "undefined") return;
  window.__sendwishesMedia?.mediaElements.delete(el);
  const cleanup = mediaElementCleanup.get(el);
  if (cleanup) cleanup();
  mediaElementCleanup.delete(el);
}

export function registerSendwishesAudioContext(ctx: AudioContext) {
  if (typeof window === "undefined") return;
  const registry = ensureRegistry();
  registry.audioContexts.add(ctx);

  if (!audioContextCleanup.has(ctx)) {
    const suspend = () => {
      suspendAudioContext(ctx);
      setMediaSessionPaused();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") suspend();
    };

    window.addEventListener("pagehide", suspend, { capture: true });
    window.addEventListener("blur", suspend, { capture: true });
    window.addEventListener("beforeunload", suspend, { capture: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { capture: true });
    document.addEventListener("freeze" as unknown as "visibilitychange", suspend, { capture: true });

    audioContextCleanup.set(ctx, () => {
      window.removeEventListener("pagehide", suspend, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("blur", suspend, { capture: true } as AddEventListenerOptions);
      window.removeEventListener("beforeunload", suspend, { capture: true } as AddEventListenerOptions);
      document.removeEventListener("visibilitychange", onVisibilityChange, { capture: true } as AddEventListenerOptions);
      document.removeEventListener(
        "freeze" as unknown as "visibilitychange",
        suspend,
        { capture: true } as AddEventListenerOptions
      );
    });
  }
}

export function unregisterSendwishesAudioContext(ctx: AudioContext) {
  if (typeof window === "undefined") return;
  window.__sendwishesMedia?.audioContexts.delete(ctx);
  const cleanup = audioContextCleanup.get(ctx);
  if (cleanup) cleanup();
  audioContextCleanup.delete(ctx);
}

export function PauseMediaOnBackground() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const pauseAllMedia = () => {
      try {
        const els = document.querySelectorAll("audio,video");
        for (const node of Array.from(els)) {
          muteFirstPause(node as HTMLMediaElement);
        }
      } catch {
        // ignore
      }

      const registry = window.__sendwishesMedia;
      if (registry?.mediaElements) {
        for (const el of registry.mediaElements) muteFirstPause(el);
      }

      if (registry?.audioContexts) {
        for (const ctx of registry.audioContexts) suspendAudioContext(ctx);
      }

      // Best-effort: reflect the paused state to the OS media controls.
      setMediaSessionPaused();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") pauseAllMedia();
    };

    document.addEventListener("visibilitychange", onVisibilityChange, { capture: true });
    window.addEventListener("pagehide", pauseAllMedia, { capture: true });
    window.addEventListener("blur", pauseAllMedia, { capture: true });
    window.addEventListener("beforeunload", pauseAllMedia, { capture: true });

    // Page Lifecycle API (mobile browsers sometimes freeze pages).
    // Typescript lib.dom doesn't include these everywhere, so we cast.
    document.addEventListener("freeze" as unknown as "visibilitychange", pauseAllMedia, { capture: true });

    return () => {
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
        { capture: true } as EventListenerOptions
      );
      window.removeEventListener(
        "pagehide",
        pauseAllMedia,
        { capture: true } as EventListenerOptions
      );
      window.removeEventListener(
        "blur",
        pauseAllMedia,
        { capture: true } as EventListenerOptions
      );
      window.removeEventListener(
        "beforeunload",
        pauseAllMedia,
        { capture: true } as EventListenerOptions
      );
      document.removeEventListener(
        "freeze" as unknown as "visibilitychange",
        pauseAllMedia,
        { capture: true } as EventListenerOptions
      );
    };
  }, []);

  return null;
}
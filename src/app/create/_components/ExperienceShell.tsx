"use client";

import type { ReactNode } from "react";
import { FloatingHeartsBackground } from "@/components/FloatingHeartsBackground";

type ExperienceVariant = "valentine" | "birthday" | "proposal";

type ExperienceShellProps = {
  variant: ExperienceVariant;
  background?: "default" | "midnight";
  align?: "center" | "start";
  paddingY?: "default" | "none";
  children: ReactNode;
};

function shellClass(variant: ExperienceVariant, background: ExperienceShellProps["background"]) {
  if (background === "midnight") {
    return "min-h-dvh bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-black";
  }
  if (variant === "proposal") {
    return "min-h-dvh bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-50 via-pink-100 to-rose-200";
  }
  if (variant === "birthday") {
    return "min-h-dvh bg-gradient-to-br from-amber-50 via-white to-rose-50";
  }
  return "min-h-dvh bg-gradient-to-br from-rose-50 via-white to-pink-50";
}

export function ExperienceShell({
  variant,
  background = "default",
  align = "center",
  paddingY = "default",
  children,
}: ExperienceShellProps) {
  return (
    <div className={shellClass(variant, background)}>
      <div
        className={
          "relative flex min-h-dvh flex-col items-center " +
          (align === "center" ? "justify-center " : "justify-start ") +
          (paddingY === "none" ? "py-0" : "py-10")
        }
      >
        {variant === "proposal" ? <FloatingHeartsBackground count={20} /> : null}
        <div className="relative w-full">{children}</div>
      </div>
    </div>
  );
}

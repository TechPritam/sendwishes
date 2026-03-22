"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";
import { buildExperienceUrl, getSurprise, type ExperienceType, type SurpriseRecord } from "@/lib/surprises";

type ShellVariant = "valentine" | "birthday" | "proposal";

function shellVariantFor(type: ExperienceType): ShellVariant {
  if (type === "proposal" || type === "birthday" || type === "valentine") return type;
  return "valentine";
}

async function copyText(text: string) {
  if (typeof navigator === "undefined") return false;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(el);
  return ok;
}

// Cleaner, sharper Heart Logo for the QR center
function buildHeartDataUri() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#e11d48"/>
</svg>`.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function ShareClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const qrWrapRef = useRef<HTMLDivElement | null>(null);
  const [record, setRecord] = useState<SurpriseRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const downloadQr = () => {
    const wrap = qrWrapRef.current;
    if (!wrap) return;
    const svg = wrap.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;

    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sendwishes-qr-${id ?? "surprise"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.setTimeout(() => URL.revokeObjectURL(url), 800);
  };

  useEffect(() => {
    if (!id) return;
    const r = getSurprise(id);
    setRecord(r);
    setLoaded(true);
  }, [id]);

  const shareUrl = useMemo(() => {
    if (!id || !record) return "";
    return buildExperienceUrl(record.type, id);
  }, [id, record]);

  const heartSrc = useMemo(() => buildHeartDataUri(), []);

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`I have a special surprise for you! 💌 Open it here: ${shareUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shellVariant = record ? shellVariantFor(record.type) : "valentine";

  if (!loaded) return null;

  return (
    <ExperienceShell variant={shellVariant}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14 min-h-screen">
        <header className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-6 animate-bounce">
            ♥ Surprise Created!
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-zinc-900 tracking-tight">
            Send it with <span className="text-rose-500">Love</span>
          </h1>
          <p className="mt-4 text-zinc-500 text-lg">
            {record?.name ? `Birthday surprise for ${record.name} is ready to be shared.` : "Your magic link is ready to be shared."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left Side: QR Code Section */}
          <div className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-pink-300" /> */}
            
            <div ref={qrWrapRef} className="relative p-6 bg-white rounded-3xl shadow-inner">
              <QRCodeSVG
                value={shareUrl}
                size={220}
                level="H"
                fgColor="#e11d48" // Solid Rose-600 for high scannability
                marginSize={0}
                imageSettings={{
                  src: heartSrc,
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>
            
            <p className="mt-6 text-rose-800 font-medium text-sm text-center">
              Scan to preview your craft 💌
            </p>
          </div>

          {/* Right Side: Sharing Actions */}
          <div className="flex flex-col gap-4 my-10">
            <div className="p-6 bg-white/60 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                Your Unique Link
              </label>
              <div className="flex gap-2">
                <input
                  value={shareUrl}
                  readOnly
                  className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-zinc-600 focus:outline-none"
                />
                <button
                  onClick={async () => {
                    const ok = await copyText(shareUrl);
                    setCopyState(ok ? "copied" : "failed");
                    setTimeout(() => setCopyState("idle"), 2000);
                  }}
                  className="bg-zinc-900 text-white px-6 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all active:scale-95"
                >
                  {copyState === "copied" ? "Done!" : "Copy"}
                </button>
              </div>
            </div>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] text-white rounded-3xl font-bold text-lg shadow-lg shadow-green-200 hover:brightness-105 transition-all active:scale-[0.98]"
            >
              Share via WhatsApp
            </button>

            <button
              onClick={downloadQr}
              className="w-full py-4 bg-white/80 border border-zinc-200 text-zinc-600 rounded-3xl font-bold text-sm hover:bg-zinc-50 transition-all"
            >
              Download QR
            </button>
          </div>
        </div>
      </div>
    </ExperienceShell>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { ExperienceShell } from "@/app/create/_components/ExperienceShell";

// UPDATE THIS URL to your Cloudflare Worker URL
const API_URL = "https://send-your-wishes-be.send-your-wishes.workers.dev";

type ExperienceType = "proposal" | "valentine" | "puzzle" | "sorry" | "birthday" | "wedding";
type ShellVariant = "valentine" | "birthday" | "proposal" | "sorry" ;

function shellVariantFor(type: ExperienceType): ShellVariant {
  if (type === "proposal" || type === "birthday" || type === "valentine" || type === "sorry") return type;
  return "valentine";
}

async function copyText(text: string) {
  if (typeof navigator === "undefined") return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function buildHeartDataUri() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#e11d48"/>
</svg>`.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function ShareClient() {
  const params = useParams<{ id: string }>();
  const slug = params?.id; // This is the unique slug from DB
  const qrWrapRef = useRef<HTMLDivElement | null>(null);
  
  type RecordType = { type: ExperienceType; name?: string };
  const [record, setRecord] = useState<RecordType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  // 1. Fetch the record from Cloudflare instead of LocalStorage
  useEffect(() => {
    if (!slug) return;

    async function fetchRecord() {
      try {
        const res = await fetch(`${API_URL}/api/card/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setRecord(data);
      } catch (err) {
        console.error("Failed to fetch record:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecord();
  }, [slug]);

  // 2. Generate the dynamic share URL based on current domain
  const shareUrl = useMemo(() => {
    if (!slug || !record) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/${record.type}/${slug}`;
  }, [slug, record]);

  const heartSrc = useMemo(() => buildHeartDataUri(), []);

  const handleWhatsAppShare = async () => {
    if (!shareUrl) return;
    const text = `🎁 I made a surprise for you! 💌\n\nScan the QR 📷 or open the link 🔗:\n${shareUrl}\n\nCan’t wait for you to see it ✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text, url: shareUrl });
      } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const downloadQr = () => {
    const wrap = qrWrapRef.current;
    if (!wrap) return;
    const svg = wrap.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `surprise-qr-${slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="animate-pulse text-rose-500 font-bold tracking-widest text-sm">PREPARING YOUR LINK...</div>
    </div>
  );

  const shellVariant = record ? shellVariantFor(record.type) : "valentine";

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
            {record?.name 
              ? `Your ${record.type} surprise for ${record.name} is ready.` 
              : "Your magic link is ready to be shared."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl overflow-hidden group">
            <div ref={qrWrapRef} className="relative p-6 bg-white rounded-3xl shadow-inner">
              <QRCodeSVG
                value={shareUrl}
                size={220}
                level="H"
                fgColor="#e11d48"
                marginSize={0}
                imageSettings={{
                  src: heartSrc,
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>
            <p className="mt-6 text-rose-800 font-medium text-sm text-center font-mono">
              Ready to be scanned 💌
            </p>
          </div>

          {/* Sharing Actions */}
          <div className="flex flex-col gap-4 my-auto">
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
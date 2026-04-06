"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeddingInvitation from "./WeddingInvitation";
import Template2 from "./templates/Template2";
import WhatsappButton from "./WhatsappButton";
import { useRouter, useSearchParams } from "next/navigation";
import { getWeddingTemplateMeta, isWeddingTemplateId } from "@/lib/weddingTemplates";

// --- Types & Constants ---
interface Event {
  name: string;
  date: string;
  time: string;
  image: string;
}

const EVENT_TYPES = [
  { label: "Sangeet", value: "Sangeet", img: "/assets/sangeet.jpg" },
  { label: "Haldi", value: "Haldi", img: "/assets/haldi.jpg" },
  { label: "Shadi (Wedding)", value: "Shadi", img: "/assets/shadi.jpg" },
  { label: "Reception", value: "Reception", img: "/assets/reception.jpg" },
];

const API_URL = "https://send-your-wishes-be.send-your-wishes.workers.dev";

export default function WeddingCreateClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const templateId = isWeddingTemplateId(templateParam) ? templateParam : "royal";
  const templateMeta = getWeddingTemplateMeta(templateId);

  const isDev = process.env.NODE_ENV === "development";

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const groomPhotoInputRef = useRef<HTMLInputElement>(null);
  const bridePhotoInputRef = useRef<HTMLInputElement>(null);

  const revokeIfBlobUrl = (url?: string) => {
    if (!url || !url.startsWith("blob:")) return;
    try {
      URL.revokeObjectURL(url);
    } catch {
      /* no-op */
    }
  };

  const [details, setDetails] = useState(() => {
    const base = {
      templateId,
      groom: "",
      bride: "",
      date: "",
      time: "",
      location: "",
      groomParents: "",
      brideParents: "",
      rsvpPhone: "",
      dressCode: "",
      weddingHashtag: "",
      preWeddingVideoUrl: "",
      heroImage: "/assets/rashmika.jpg",
      groomPhoto: "",
      bridePhoto: "",
      groomMessage:
        "From the moment I met you, the world felt kinder. I promise to choose you — in the big celebrations and the quiet everyday.",
      brideMessage:
        "You are my calm and my chaos, my best friend and my safest place. I can’t wait to build a life full of love, laughter and late-night chai.",
      gallery: ["/assets/carousel1.jpg", "/assets/carousel2.jpg", "/assets/carousel3.jpg"],
      events: [] as Event[],
    };

    if (!isDev) return base;

    const weddingDate = "2026-06-20";
    return {
      ...base,
      groom: "Aarav",
      bride: "Siya",
      date: weddingDate,
      time: "19:30",
      location: "The Taj Mahal Palace, Mumbai",
      groomParents: "Rajesh & Sunita Sharma",
      brideParents: "Mahesh & Kavita Iyer",
      rsvpPhone: "+91 98XXXXXX10",
      dressCode: "Traditional / Festive",
      weddingHashtag: "#AaravWedsSiya",
      events: [
        { name: "Sangeet", date: "2026-06-18", time: "19:00", image: "/assets/sangeet.jpg" },
        { name: "Haldi", date: "2026-06-19", time: "10:30", image: "/assets/haldi.jpg" },
        { name: "Shadi", date: weddingDate, time: "19:30", image: "/assets/shadi.jpg" },
      ],
    };
  });

  useEffect(() => {
    setDetails((prev) => (prev.templateId === templateId ? prev : { ...prev, templateId }));
  }, [templateId]);

  // Template-specific sensible defaults when switching to hindu.
  useEffect(() => {
    if (templateId !== "hindu") return;
    setDetails((prev) => {
      if (prev.templateId !== "hindu") return prev;
      return {
        ...prev,
        groomMessage:
          (prev.groomMessage || "").trim().length > 0
            ? prev.groomMessage
            : "From the moment I met you, the world felt kinder. I promise to choose you — in the big celebrations and the quiet everyday.",
        brideMessage:
          (prev.brideMessage || "").trim().length > 0
            ? prev.brideMessage
            : "You are my calm and my chaos, my best friend and my safest place. I can’t wait to build a life full of love, laughter and late-night chai.",
      };
    });
  }, [templateId]);

  const [heroUpload, setHeroUpload] = useState<{ url: string; file: File } | null>(null);
  const [groomPhotoUpload, setGroomPhotoUpload] = useState<{ url: string; file: File } | null>(null);
  const [bridePhotoUpload, setBridePhotoUpload] = useState<{ url: string; file: File } | null>(null);
  const [galleryUploads, setGalleryUploads] = useState<Record<string, File>>({});

  const normalizeWorkerImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    if (imageUrl.startsWith("/")) return `${API_URL}${imageUrl}`;
    return `${API_URL}/${imageUrl}`;
  };

  const uploadToWorker = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Upload failed");
    }

    const data = (await res.json()) as { imageUrl?: string };
    if (!data.imageUrl) throw new Error("Upload failed: missing imageUrl");
    return normalizeWorkerImageUrl(data.imageUrl);
  };

  // --- Handlers: File Validations ---
  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      alert(`Invalid format: ${file.name}. Please upload JPG, PNG or WEBP.`);
      return false;
    }
    if (file.size > maxSize) {
      alert(`File too large: ${file.name}. Max size is 5MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hero" | "gallery" | "groomPhoto" | "bridePhoto",
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "hero") {
      const file = files[0];
      if (!validateFile(file)) {
        e.target.value = "";
        return;
      }
      const url = URL.createObjectURL(file);
      revokeIfBlobUrl(details.heroImage);
      setDetails({ ...details, heroImage: url });
      setHeroUpload({ url, file });
    } else if (type === "groomPhoto") {
      const file = files[0];
      if (!validateFile(file)) {
        e.target.value = "";
        return;
      }
      const url = URL.createObjectURL(file);
      revokeIfBlobUrl(details.groomPhoto);
      setDetails({ ...details, groomPhoto: url });
      setGroomPhotoUpload({ url, file });
    } else if (type === "bridePhoto") {
      const file = files[0];
      if (!validateFile(file)) {
        e.target.value = "";
        return;
      }
      const url = URL.createObjectURL(file);
      revokeIfBlobUrl(details.bridePhoto);
      setDetails({ ...details, bridePhoto: url });
      setBridePhotoUpload({ url, file });
    } else {
      const validFiles = Array.from(files).filter(validateFile);
      const entries = validFiles.map((file) => ({ url: URL.createObjectURL(file), file }));
      setDetails({ ...details, gallery: [...details.gallery, ...entries.map((e) => e.url)] });
      setGalleryUploads((prev) => {
        const next = { ...prev };
        for (const entry of entries) next[entry.url] = entry.file;
        return next;
      });
    }

    e.target.value = "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const removeGalleryImage = (index: number) => {
    const url = details.gallery[index];
    revokeIfBlobUrl(url);
    if (url && url.startsWith("blob:")) {
      setGalleryUploads((prev) => {
        const next = { ...prev };
        delete next[url];
        return next;
      });
    }
    setDetails({ ...details, gallery: details.gallery.filter((_, i) => i !== index) });
  };

  // --- Handlers: Events ---
  const addEvent = (typeName: string) => {
    if (details.events.find((e) => e.name === typeName)) return;
    const template = EVENT_TYPES.find((t) => t.value === typeName);
    const newEvent: Event = {
      name: typeName,
      date: details.date || "", // Inherit main date if available
      time: "",
      image: template?.img || "",
    };
    setDetails({ ...details, events: [...details.events, newEvent] });
  };

  const updateEvent = (index: number, field: keyof Event, value: string) => {
    const updated = [...details.events];
    updated[index] = { ...updated[index], [field]: value };
    setDetails({ ...details, events: updated });
  };

  const removeEvent = (name: string) => {
    setDetails({ ...details, events: details.events.filter((e) => e.name !== name) });
  };

  // --- CRITICAL FIX: Strict Validation ---
  const validateAndPreview = () => {
    const { groom, bride, location, date, time, events } = details;

    if (!groom.trim() || !bride.trim()) {
      alert("Please enter the names of the Groom and Bride.");
      return;
    }
    if (!location.trim()) {
      alert("Please specify the Venue/Location.");
      return;
    }
    if (!date || !time) {
      alert("Please select the main Wedding Date and Time.");
      return;
    }
    if (events.length === 0) {
      alert("Please select at least one wedding event (e.g., Sangeet, Haldi, or Shadi).");
      return;
    }

    const incompleteEvent = events.find((e) => !e.date || !e.time);
    if (incompleteEvent) {
      alert(`Please provide a Date and Time for the ${incompleteEvent.name} ceremony.`);
      return;
    }

    setIsPreview(true);
  };

  const handleSaveAndGetLink = async () => {
    if (isSaving) return;

    // Safety: ensure required fields are present even if user somehow bypassed preview validation.
    const { groom, bride, location, date, time, events } = details;
    if (!groom.trim() || !bride.trim() || !location.trim() || !date || !time || events.length === 0) {
      validateAndPreview();
      return;
    }

    setIsSaving(true);
    const draftId = crypto.randomUUID();

    try {
      // 1) Upload any newly-selected images (blob URLs) to the Worker.
      let heroImage = details.heroImage;
      if (heroImage && heroImage.startsWith("blob:")) {
        const file = heroUpload?.url === heroImage ? heroUpload.file : null;
        if (!file) throw new Error("Missing hero image file");
        heroImage = await uploadToWorker(file);
      }

      let groomPhoto = details.groomPhoto;
      if (groomPhoto && groomPhoto.startsWith("blob:")) {
        const file = groomPhotoUpload?.url === groomPhoto ? groomPhotoUpload.file : null;
        if (!file) throw new Error("Missing groom photo file");
        groomPhoto = await uploadToWorker(file);
      }

      let bridePhoto = details.bridePhoto;
      if (bridePhoto && bridePhoto.startsWith("blob:")) {
        const file = bridePhotoUpload?.url === bridePhoto ? bridePhotoUpload.file : null;
        if (!file) throw new Error("Missing bride photo file");
        bridePhoto = await uploadToWorker(file);
      }

      const gallery = await Promise.all(
        (details.gallery || []).map(async (url) => {
          if (!url || !url.startsWith("blob:")) return url;
          const file = galleryUploads[url];
          if (!file) throw new Error("Missing gallery image file");
          return uploadToWorker(file);
        }),
      );

      const config = {
        type: "wedding" as const,
        name: `${details.bride.trim()} & ${details.groom.trim()}`.trim(),
        templateId: details.templateId,
        groom: details.groom.trim(),
        bride: details.bride.trim(),
        date: details.date,
        time: details.time,
        location: details.location.trim(),
        groomParents: details.groomParents?.trim(),
        brideParents: details.brideParents?.trim(),
        rsvpPhone: details.rsvpPhone?.trim(),
        dressCode: details.dressCode?.trim(),
        weddingHashtag: details.weddingHashtag?.trim(),
        preWeddingVideoUrl: details.preWeddingVideoUrl?.trim(),
        heroImage,
        groomPhoto: groomPhoto?.trim() ? groomPhoto : undefined,
        bridePhoto: bridePhoto?.trim() ? bridePhoto : undefined,
        groomMessage: details.groomMessage?.trim(),
        brideMessage: details.brideMessage?.trim(),
        gallery,
        events: details.events,
      };

      // 2) Save Draft
      const saveRes = await fetch(`${API_URL}/api/save-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draftId, type: "wedding", config }),
      });
      if (!saveRes.ok) throw new Error("Failed to save draft");

      // 3) Activate Link
      const res = await fetch(`${API_URL}/api/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });

      if (!res.ok) throw new Error("Activation failed");
      const { slug } = (await res.json()) as { slug?: string };
      if (!slug) throw new Error("Activation failed: missing slug");

      router.push(`/share/${slug}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save and generate link. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-rose-950 pb-20 selection:bg-rose-200">
      <input
        type="file"
        ref={heroInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, "hero")}
      />
      <input
        type="file"
        ref={galleryInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange(e, "gallery")}
      />
      <input
        type="file"
        ref={groomPhotoInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, "groomPhoto")}
      />
      <input
        type="file"
        ref={bridePhotoInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, "bridePhoto")}
      />

      <AnimatePresence mode="wait">
        {!isPreview ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 pt-16 max-w-2xl mx-auto">
            <header className="text-center mb-12">
              <span className="text-[10px] tracking-[0.5em] uppercase text-rose-400 font-bold">Studio Beta</span>
              <h1 className="font-serif text-5xl text-[rgb(121_29_80)] mt-3">The Wedding Edit</h1>
              <div className="mt-4 inline-flex items-center justify-center rounded-full border border-rose-100 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-rose-700">
                {templateMeta.title}
              </div>
            </header>

            <div className="space-y-10">
              {/* 01: PROTAGONISTS */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100/50">
                <SectionHeading step="01" title="The Protagonists" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <InputGroup
                    label="Groom's Name"
                    name="groom"
                    placeholder="Full Name"
                    value={details.groom}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="Bride's Name"
                    name="bride"
                    placeholder="Full Name"
                    value={details.bride}
                    onChange={handleInputChange}
                  />
                </div>
              </section>

              {/* 02: VISUALS */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100/50">
                <SectionHeading step="02" title="Visual Aesthetic" />
                <div className="mt-8 space-y-10">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 block">
                      Primary Hero Photo
                    </label>
                    <div
                      className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border-8 border-[rgb(223,223,223)] shadow-inner bg-rose-50/10 group cursor-pointer"
                      onClick={() => heroInputRef.current?.click()}
                    >
                      <img
                        src={details.heroImage}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        alt="Hero Preview"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white text-rose-900 px-6 py-2 rounded-full font-bold text-xs shadow-xl">
                          Change Cover Photo
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Carousel Gallery
                      </label>
                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-[10px] font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-full border border-rose-100"
                      >
                        + Add Photos
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {details.gallery.map((img, idx) => (
                        <motion.div
                          layout
                          key={img}
                          className="relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-50 group"
                        >
                          <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                          <button
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute inset-0 bg-rose-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 03: EVENT TIMELINE */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100/50">
                <SectionHeading step="03" title="Event Timeline" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {EVENT_TYPES.map((type) => {
                    const isSelected = !!details.events.find((e) => e.name === type.value);
                    return (
                      <button
                        key={type.value}
                        onClick={() => (isSelected ? removeEvent(type.value) : addEvent(type.value))}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                          isSelected ? "bg-rose-50 border-rose-400" : "bg-white border-rose-50 hover:border-rose-200"
                        }`}
                      >
                        <span className={`text-xl mb-1 ${isSelected ? "text-rose-500" : "text-rose-200"}`}>
                          {isSelected ? "✓" : "○"}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tight ${
                            isSelected ? "text-rose-900" : "text-zinc-400"
                          }`}
                        >
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-4">
                  {details.events.map((event, index) => (
                    <motion.div
                      layout
                      key={event.name}
                      className="p-6 bg-rose-50/20 border border-rose-100 rounded-[2rem] relative border-l-4 border-l-rose-400 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-serif text-xl text-rose-900">{event.name}</h4>
                        <button
                          onClick={() => removeEvent(event.name)}
                          className="text-rose-300 hover:text-rose-600 transition-colors text-lg"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup
                          label="Date"
                          type="date"
                          value={event.date}
                          onChange={(e) => updateEvent(index, "date", e.target.value)}
                        />
                        <InputGroup
                          label="Time"
                          type="time"
                          value={event.time}
                          onChange={(e) => updateEvent(index, "time", e.target.value)}
                        />
                      </div>
                    </motion.div>
                  ))}
                  {details.events.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-rose-100 rounded-3xl">
                      <p className="text-xs text-zinc-400 italic">Select at least one event above to continue.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* 04: VENUE */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100/50">
                <SectionHeading step="04" title="Venue Details" />
                <div className="mt-8 space-y-6">
                  <InputGroup
                    label="Main Venue Address"
                    name="location"
                    placeholder="e.g., The Taj Mahal Palace, Mumbai"
                    value={details.location}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Wedding Date" name="date" type="date" value={details.date} onChange={handleInputChange} />
                    <InputGroup label="Ceremony Time" name="time" type="time" value={details.time} onChange={handleInputChange} />
                  </div>
                </div>
              </section>

              <button
                onClick={validateAndPreview}
                className="w-full bg-[rgb(121_29_80)] text-white py-3  rounded-[2rem] font-bold shadow-2xl shadow-rose-200 hover:bg-rose-950 active:scale-[0.98] transition-all text-xl mt-12 mb-20"
              >
                See Preview ✨
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-[#FDFBF7] overflow-y-auto">
            {details.templateId === "hindu" ? <Template2 details={details} /> : <WeddingInvitation details={details} />}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-[200] w-[92%] max-w-md">
              <button
                onClick={() => setIsPreview(false)}
                className="flex-1 bg-white/95 backdrop-blur-md border border-rose-200 text-rose-700 py-4 rounded-2xl font-bold shadow-2xl transition-transform active:scale-95"
              >
                Edit Details
              </button>
              <WhatsappButton
                phone={"+919146920640"}
                message={`Hi! I just finalized my wedding invitation using the ${details.templateId} template. I'd like to lock this in and get my wedding invite link !`}
                className="flex-[2] py-4 rounded-2xl font-bold shadow-2xl transition-transform active:scale-95 disabled:opacity-60 bg-green-500 hover:bg-green-600"
              ></WhatsappButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeading({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-100 shadow-sm">
        {step}
      </span>
      <h2 className="font-serif text-2xl text-rose-950 tracking-tight">{title}</h2>
    </div>
  );
}

type InputGroupProps = {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
};

function InputGroup({ label, name, value, onChange, type = "text", placeholder = "" }: InputGroupProps) {
  return (
    <div className="w-full">
      <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="w-full p-4 bg-rose-50/10 border border-rose-100 rounded-2xl outline-none focus:border-rose-400 focus:bg-white transition-all font-serif text-lg text-rose-900 shadow-sm placeholder:text-rose-200
          [&::-webkit-calendar-picker-indicator]:opacity-0 
          [&::-webkit-calendar-picker-indicator]:absolute 
          [&::-webkit-calendar-picker-indicator]:w-full
          relative"
      />
    </div>
  );
}

// Note: TextAreaGroup kept (even if currently unused) to avoid losing commented-out section support.
type TextAreaGroupProps = {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  name: string;
  placeholder?: string;
};

function TextAreaGroup({ label, name, value, onChange, placeholder = "" }: TextAreaGroupProps) {
  return (
    <div className="w-full mt-6">
      <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        rows={4}
        className="w-full p-4 bg-rose-50/10 border border-rose-100 rounded-2xl outline-none focus:border-rose-400 focus:bg-white transition-all font-serif text-base text-rose-900 shadow-sm placeholder:text-rose-200 resize-none"
      />
    </div>
  );
}
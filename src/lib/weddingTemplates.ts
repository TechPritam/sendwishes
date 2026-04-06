export type WeddingTemplateId = "royal" | "hindu" | "cute" | "cultural";

export type WeddingTemplateMeta = {
  id: WeddingTemplateId;
  title: string;
  subtitle: string;
  description: string;
  thumbnailSrc: string;
  comingSoon?: boolean;
};

export const WEDDING_TEMPLATES: WeddingTemplateMeta[] = [
  {
    id: "royal",
    title: "The Royal Wedding",
    subtitle: "Studio Beta",
    description: "Modern, cinematic and interactive — scratch reveal, gallery reel, timeline and RSVP.",
    thumbnailSrc: "/assets/shadi.png",
  },
  {
    id: "hindu",
    title: "Shubh Vivah Patrika",
    subtitle: "Studio Beta",
    description: "Traditional Hindu invite with blessings, family names, muhurat feel and a classic backdrop.",
    thumbnailSrc: "/assets/doli.png",
  },
   {
    id: "cute",
    title: "Cute Wedding",
    subtitle: "Studio Beta",
    description: "A cute and charming wedding invite with playful elements and a lighthearted feel.",
    thumbnailSrc: "/assets/cute-shadi.png",
    comingSoon: true,
  },
   {
    id: "cultural",
    title: "Cute Wedding 2",
    subtitle: "Studio Beta",
    description: "A wedding invite that celebrates cultural traditions and heritage.",
    thumbnailSrc: "/assets/cute-shadi2.png",
    comingSoon: true,
  },
];

export function isWeddingTemplateId(value: string | null | undefined): value is WeddingTemplateId {
  return value === "royal" || value === "hindu" || value === "cute" || value === "cultural";
}

export function getWeddingTemplateMeta(id: WeddingTemplateId): WeddingTemplateMeta {
  return WEDDING_TEMPLATES.find((t) => t.id === id) ?? WEDDING_TEMPLATES[0];
}
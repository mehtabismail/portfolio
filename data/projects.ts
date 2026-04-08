// Mock project data – same 11 projects as original site (Phase 2 will load from Firestore)
export interface Project {
  slug: string;
  title: string;
  titleDisplay: string; // e.g. "FABRIC™"
  // Phase 2: publishing flag (currently not used for filtering/hiding on frontend)
  isPublished?: boolean;
  location: string;
  year: string;
  services: string;
  categories: readonly ("design" | "development" | "interaction")[];
  thumbnailBg: string;
  thumbnailUrl: string;
  thumbnailHoverUrl?: string; // 810x810 for hover preview
  // Phase 2.6 media fields (Cloudinary-ready)
  heroImageUrl?: string;
  gallery?: string[];
  videoUrl?: string;
  role?: string;
  credits?: string;
  liveUrl?: string;
  order: number;
}

export const projects: Project[] = [
  {
    slug: "twice",
    title: "TWICE",
    titleDisplay: "TWICE",
    location: "Spain",
    year: "2024",
    services: "Interaction & Development",
    categories: ["development", "interaction"] as const,
    thumbnailBg: "#F1F1F1",
    thumbnailUrl: "/media/pages/work/twice/0ab7e43954-1710404752/thumbnail-twice.jpg",
    thumbnailHoverUrl: "/media/pages/work/twice/0ab7e43954-1710404752/thumbnail-twice-810x810-crop-q72.jpg",
    role: "Interaction & Development",
    credits: "Design: Dylan Brouwer",
    liveUrl: "https://twicemediahouse.com/",
    order: 0,
  },
  {
    slug: "the-damai",
    title: "The Damai",
    titleDisplay: "The Damai",
    location: "Bali, Indonesia",
    year: "2024",
    services: "Design & Development",
    categories: ["design", "development", "interaction"] as const,
    thumbnailBg: "#E0D9D1",
    thumbnailUrl: "/media/pages/work/the-damai/b511d32d21-1710452224/thumbnail-thedamai-v2.jpg",
    thumbnailHoverUrl: "/media/pages/work/the-damai/b511d32d21-1710452224/thumbnail-thedamai-v2-810x810-crop-q72.jpg",
    order: 1,
  },
  {
    slug: "fabric",
    title: "FABRIC",
    titleDisplay: "FABRIC™",
    location: "United Kingdom",
    year: "2023",
    services: "Design & Development",
    categories: ["design", "development", "interaction"] as const,
    thumbnailBg: "#48494A",
    thumbnailUrl: "/media/pages/work/fabric/ac07564a5f-1688453092/thumbnail-fabric-darkgray.jpg",
    thumbnailHoverUrl: "/media/pages/work/fabric/ac07564a5f-1688453092/thumbnail-fabric-darkgray-810x810-crop-q72.jpg",
    order: 2,
  },
  {
    slug: "aanstekelijk",
    title: "Aanstekelijk",
    titleDisplay: "Aanstekelijk",
    location: "The Netherlands",
    year: "2023",
    services: "Design & Development",
    categories: ["design", "development", "interaction"] as const,
    thumbnailBg: "#101010",
    thumbnailUrl: "/media/pages/work/aanstekelijk/441187fb44-1687423090/thumbnail-aanstekelijk.jpg",
    thumbnailHoverUrl: "/media/pages/work/aanstekelijk/441187fb44-1687423090/thumbnail-aanstekelijk-810x810-crop-q72.jpg",
    order: 3,
  },
  {
    slug: "base-create",
    title: "Base Create",
    titleDisplay: "Base Create",
    location: "Hong Kong",
    year: "2023",
    services: "Design & Development",
    categories: ["development", "interaction", "design"] as const,
    thumbnailBg: "#363637",
    thumbnailUrl: "/media/pages/work/base-create/1f2468ab51-1680179645/thumbnail-base-desktop.jpg",
    thumbnailHoverUrl: "/media/pages/work/base-create/1f2468ab51-1680179645/thumbnail-base-desktop-810x810-crop-q72.jpg",
    order: 4,
  },
  {
    slug: "avvr",
    title: "AVVR",
    titleDisplay: "AVVR",
    location: "The Netherlands",
    year: "2023",
    services: "Design & Development",
    categories: ["design", "development", "interaction"] as const,
    thumbnailBg: "#D8D3CD",
    thumbnailUrl: "/media/pages/work/avvr/4d2a7758a4-1672918357/thumbnail-avvr-v2.jpg",
    thumbnailHoverUrl: "/media/pages/work/avvr/4d2a7758a4-1672918357/thumbnail-avvr-v2-810x810-crop-q72.jpg",
    order: 5,
  },
  {
    slug: "graphichunters",
    title: "GraphicHunters",
    titleDisplay: "GraphicHunters",
    location: "The Netherlands",
    year: "2022",
    services: "Design & Development",
    categories: ["design", "development"] as const,
    thumbnailBg: "#7E7E7E",
    thumbnailUrl: "/media/pages/work/graphichunters/0daec771af-1660128857/thumbnail-gh.jpg",
    thumbnailHoverUrl: "/media/pages/work/graphichunters/0daec771af-1660128857/thumbnail-gh-810x810-crop-q72.jpg",
    order: 6,
  },
  {
    slug: "future-goals",
    title: "Future Goals",
    titleDisplay: "Future Goals",
    location: "Curaçao",
    year: "2022",
    services: "Interaction & Development",
    categories: ["development", "interaction"] as const,
    thumbnailBg: "#DCD0C2",
    thumbnailUrl: "/media/pages/work/future-goals/614e28a662-1653057688/thumbnail-futuregoals.jpg",
    thumbnailHoverUrl: "/media/pages/work/future-goals/614e28a662-1653057688/thumbnail-futuregoals-810x810-crop-q72.jpg",
    order: 7,
  },
  {
    slug: "atypikal",
    title: "Atypikal",
    titleDisplay: "Atypikal",
    location: "United States",
    year: "2021",
    services: "Interaction & Development",
    categories: ["development", "interaction"] as const,
    thumbnailBg: "#B1A994",
    thumbnailUrl: "/media/pages/work/atypikal/fd1951ffc9-1646837277/thumbnail-atypikal.jpg",
    thumbnailHoverUrl: "/media/pages/work/atypikal/fd1951ffc9-1646837277/thumbnail-atypikal-810x810-crop-q72.jpg",
    order: 8,
  },
  {
    slug: "one-nil",
    title: "One:Nil",
    titleDisplay: "One:Nil",
    location: "The Netherlands",
    year: "2021",
    services: "Interaction & Development",
    categories: ["development", "interaction"] as const,
    thumbnailBg: "var(--color-lightgray)",
    thumbnailUrl: "/media/pages/work/one-nil/288460827e-1646837272/thumbnail-onenil-v3.jpg",
    thumbnailHoverUrl: "/media/pages/work/one-nil/288460827e-1646837272/thumbnail-onenil-v3-810x810-crop-q72.jpg",
    order: 9,
  },
  {
    slug: "andy-hardy",
    title: "Andy Hardy",
    titleDisplay: "Andy Hardy",
    location: "Australia",
    year: "2020",
    services: "Design & Development",
    categories: ["design", "development"] as const,
    thumbnailBg: "#626D6E",
    thumbnailUrl: "/media/pages/work/andy-hardy/f152b03247-1646837253/thumbnail-andyhardy.jpg",
    thumbnailHoverUrl: "/media/pages/work/andy-hardy/f152b03247-1646837253/thumbnail-andyhardy-810x810-crop-q72.jpg",
    order: 10,
  },
].sort((a, b) => a.order - b.order);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(count = 4): Project[] {
  return projects.slice(0, count);
}

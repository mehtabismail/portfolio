import type { ContactContent, Project, SiteContent, UserData } from "@/data";
import { contactContent, siteContent, user } from "@/data";
import { unstable_cache } from "next/cache";
import { getFirebaseAdminDb } from "./firebase-admin";

/** Seconds to cache Firestore reads in the Next.js Data Cache (production + warm dev). */
const CONTENT_REVALIDATE =
  Number(process.env.CONTENT_REVALIDATE_SECONDS ?? "60") || 60;

type FirestoreDoc<T> = Partial<T> & { [key: string]: unknown };

/** Firestore Timestamps are class instances and break RSC → Client serialization. */
function omitFirestoreDocMeta<T extends Record<string, unknown>>(data: T): T {
  const rest = { ...data };
  delete rest.createdAt;
  delete rest.updatedAt;
  return rest as T;
}

async function readSingleton<T>(collectionName: string): Promise<FirestoreDoc<T> | null> {
  const db = getFirebaseAdminDb();
  const snapshot = await db.collection(collectionName).doc("main").get();
  if (!snapshot.exists) return null;
  return snapshot.data() as FirestoreDoc<T>;
}

const getDynamicUserCached = unstable_cache(
  async (): Promise<UserData> => {
    const remote = await readSingleton<UserData>("user");
    if (!remote) return user;
    const remotePlain = omitFirestoreDocMeta(remote as Record<string, unknown>);
    return {
      ...user,
      ...remotePlain,
      site: {
        ...user.site,
        ...(remote.site as Partial<UserData["site"]> | undefined),
      },
      socials: Array.isArray(remote.socials) ? (remote.socials as UserData["socials"]) : user.socials,
    };
  },
  ["firestore", "user", "main"],
  { revalidate: CONTENT_REVALIDATE },
);

export async function getDynamicUser(): Promise<UserData> {
  return getDynamicUserCached();
}

const getDynamicSiteContentCached = unstable_cache(
  async (): Promise<SiteContent> => {
    const remote = await readSingleton<SiteContent>("site");
    if (!remote) return siteContent;
    const remotePlain = omitFirestoreDocMeta(remote as Record<string, unknown>);
    return {
      ...siteContent,
      ...remotePlain,
      nav: { ...siteContent.nav, ...(remote.nav as Partial<SiteContent["nav"]> | undefined) },
      home: { ...siteContent.home, ...(remote.home as Partial<SiteContent["home"]> | undefined) },
      common: {
        ...siteContent.common,
        ...(remote.common as Partial<SiteContent["common"]> | undefined),
      },
      footer: {
        ...siteContent.footer,
        ...(remote.footer as Partial<SiteContent["footer"]> | undefined),
      },
      archive: {
        ...siteContent.archive,
        ...(remote.archive as Partial<SiteContent["archive"]> | undefined),
      },
      work: { ...siteContent.work, ...(remote.work as Partial<SiteContent["work"]> | undefined) },
    };
  },
  ["firestore", "site", "main"],
  { revalidate: CONTENT_REVALIDATE },
);

export async function getDynamicSiteContent(): Promise<SiteContent> {
  return getDynamicSiteContentCached();
}

const getDynamicContactContentCached = unstable_cache(
  async (): Promise<ContactContent> => {
    const remote = await readSingleton<ContactContent>("contact");
    if (!remote) return contactContent;
    const remotePlain = omitFirestoreDocMeta(remote as Record<string, unknown>);
    return {
      ...contactContent,
      ...remotePlain,
      form: {
        ...contactContent.form,
        ...(remote.form as Partial<ContactContent["form"]> | undefined),
      },
      sections: {
        ...contactContent.sections,
        ...(remote.sections as Partial<ContactContent["sections"]> | undefined),
      },
    };
  },
  ["firestore", "contact", "main"],
  { revalidate: CONTENT_REVALIDATE },
);

export async function getDynamicContactContent(): Promise<ContactContent> {
  return getDynamicContactContentCached();
}

function normalizeProject(project: FirestoreDoc<Project>): Project | null {
  const requiredFields = [
    "slug",
    "title",
    "titleDisplay",
    "location",
    "year",
    "services",
    "categories",
    "thumbnailBg",
    "thumbnailUrl",
    "order",
  ] as const;
  const hasAllRequired = requiredFields.every((field) => project[field] !== undefined);
  if (!hasAllRequired) return null;
  const plain = omitFirestoreDocMeta(project as Record<string, unknown>);
  return {
    ...(plain as unknown as Project),
    isPublished:
      typeof project.isPublished === "boolean"
        ? project.isPublished
        : true,
  };
}

const getDynamicProjectsCached = unstable_cache(
  async (): Promise<Project[]> => {
    const db = getFirebaseAdminDb();
    const snapshot = await db.collection("projects").orderBy("order", "asc").get();
    return snapshot.docs
      .map((doc) => normalizeProject(doc.data() as FirestoreDoc<Project>))
      .filter((project): project is Project => project !== null && project.isPublished !== false);
  },
  ["firestore", "projects", "all"],
  { revalidate: CONTENT_REVALIDATE },
);

export async function getDynamicProjects(): Promise<Project[]> {
  return getDynamicProjectsCached();
}

export async function getDynamicProjectBySlug(slug: string): Promise<Project | null> {
  return unstable_cache(
    async () => {
      const db = getFirebaseAdminDb();
      const snapshot = await db
        .collection("projects")
        .where("slug", "==", slug)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const project = normalizeProject(snapshot.docs[0].data() as FirestoreDoc<Project>);
      if (!project || project.isPublished === false) return null;
      return project;
    },
    ["firestore", "project", slug],
    { revalidate: CONTENT_REVALIDATE },
  )();
}

export async function getDynamicFeaturedProjects(count = 4): Promise<Project[]> {
  const all = await getDynamicProjects();
  const featured = all.filter((project) => project.isFeatured);
  if (featured.length) return featured.slice(0, count);
  return all.slice(0, count);
}


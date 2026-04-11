import type { ContactContent, Project, SiteContent, SocialLink, UserData } from "@/data";

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected an object payload");
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`Expected "${field}" to be a string`);
  }
  return value;
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Expected "${field}" to be a string array`);
  }
  return value;
}

function normalizeSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) throw new Error('Expected "socials" to be an array');
  return value.map((item, index) => {
    const record = asRecord(item);
    return {
      label: asString(record.label, `socials[${index}].label`),
      href: asString(record.href, `socials[${index}].href`),
    };
  });
}

function asOptionalNonEmptyString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new Error(`Expected "${field}" to be a string when provided`);
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function parseUserPayload(value: unknown): UserData {
  const record = asRecord(value);
  const site = asRecord(record.site);
  return {
    avatarUrl:
      asOptionalNonEmptyString(record.avatarUrl, "avatarUrl") ?? "/assets/img/Mehtab.jpg",
    firstName: asString(record.firstName, "firstName"),
    lastName: asString(record.lastName, "lastName"),
    fullName: asString(record.fullName, "fullName"),
    legalName: asString(record.legalName, "legalName"),
    role: asString(record.role, "role"),
    location: asString(record.location, "location"),
    email: asString(record.email, "email"),
    phoneRaw: asString(record.phoneRaw, "phoneRaw"),
    phoneDisplay: asString(record.phoneDisplay, "phoneDisplay"),
    coc: asString(record.coc, "coc"),
    vat: asString(record.vat, "vat"),
    site: {
      title: asString(site.title, "site.title"),
      description: asString(site.description, "site.description"),
    },
    socials: normalizeSocialLinks(record.socials),
  };
}

export function parseSitePayload(value: unknown): SiteContent {
  const record = asRecord(value);
  const nav = asRecord(record.nav);
  const home = asRecord(record.home);
  const common = asRecord(record.common);
  const footer = asRecord(record.footer);
  const archive = asRecord(record.archive);
  const work = asRecord(record.work);

  const navMainRaw = nav.main;
  if (!Array.isArray(navMainRaw)) throw new Error('Expected "nav.main" to be an array');
  const navMain = navMainRaw.map((item, index) => {
    const navItem = asRecord(item);
    return {
      href: asString(navItem.href, `nav.main[${index}].href`),
      label: asString(navItem.label, `nav.main[${index}].label`),
    };
  });

  return {
    nav: { main: navMain },
    home: {
      heroRolePrefix: asString(home.heroRolePrefix, "home.heroRolePrefix"),
      heroRoleSuffix: asString(home.heroRoleSuffix, "home.heroRoleSuffix"),
      introTitle: asString(home.introTitle, "home.introTitle"),
      introDescription: asString(home.introDescription, "home.introDescription"),
      recentWorkTitle: asString(home.recentWorkTitle, "home.recentWorkTitle"),
      moreWorkLabel: asString(home.moreWorkLabel, "home.moreWorkLabel"),
    },
    common: {
      socialsTitle: asString(common.socialsTitle, "common.socialsTitle"),
      versionLabel: asString(common.versionLabel, "common.versionLabel"),
      versionValue: asString(common.versionValue, "common.versionValue"),
      localTimeLabel: asString(common.localTimeLabel, "common.localTimeLabel"),
    },
    footer: {
      ctaLine1: asString(footer.ctaLine1, "footer.ctaLine1"),
      ctaLine2: asString(footer.ctaLine2, "footer.ctaLine2"),
      getInTouch: asString(footer.getInTouch, "footer.getInTouch"),
    },
    archive: {
      headerLine1: asString(archive.headerLine1, "archive.headerLine1"),
      headerLine2: asString(archive.headerLine2, "archive.headerLine2"),
      hoverLabel: asString(archive.hoverLabel, "archive.hoverLabel"),
      placeholder: asString(archive.placeholder, "archive.placeholder"),
    },
    work: {
      headerLine1: asString(work.headerLine1, "work.headerLine1"),
      headerLine2: asString(work.headerLine2, "work.headerLine2"),
      archiveButtonLabel: asString(work.archiveButtonLabel, "work.archiveButtonLabel"),
    },
  };
}

export function parseContactPayload(value: unknown): ContactContent {
  const record = asRecord(value);
  const form = asRecord(record.form);
  const sections = asRecord(record.sections);

  return {
    heroLine1: asString(record.heroLine1, "heroLine1"),
    heroLine2: asString(record.heroLine2, "heroLine2"),
    form: {
      fieldPhone: asString(form.fieldPhone, "form.fieldPhone"),
      fieldName: asString(form.fieldName, "form.fieldName"),
      fieldEmail: asString(form.fieldEmail, "form.fieldEmail"),
      fieldCompany: asString(form.fieldCompany, "form.fieldCompany"),
      fieldService: asString(form.fieldService, "form.fieldService"),
      fieldMessage: asString(form.fieldMessage, "form.fieldMessage"),
      placeholderName: asString(form.placeholderName, "form.placeholderName"),
      placeholderEmail: asString(form.placeholderEmail, "form.placeholderEmail"),
      placeholderCompany: asString(form.placeholderCompany, "form.placeholderCompany"),
      placeholderService: asString(form.placeholderService, "form.placeholderService"),
      submitLabel: asString(form.submitLabel, "form.submitLabel"),
    },
    sections: {
      contactDetails: asString(sections.contactDetails, "sections.contactDetails"),
      businessDetails: asString(sections.businessDetails, "sections.businessDetails"),
      socials: asString(sections.socials, "sections.socials"),
    },
  };
}

export function parseProjectPayload(value: unknown): Project {
  const record = asRecord(value);
  const categories = asStringArray(record.categories, "categories").filter(
    (c): c is "design" | "development" | "interaction" => c === "design" || c === "development" || c === "interaction",
  );

  if (!categories.length) {
    throw new Error('Expected at least one valid "categories" value');
  }

  const galleryRaw = record.gallery;
  const gallery = galleryRaw === undefined ? undefined : asStringArray(galleryRaw, "gallery");

  return {
    slug: asString(record.slug, "slug"),
    title: asString(record.title, "title"),
    titleDisplay: asString(record.titleDisplay, "titleDisplay"),
    isPublished: typeof record.isPublished === "boolean" ? record.isPublished : true,
    isFeatured: typeof record.isFeatured === "boolean" ? record.isFeatured : false,
    location: asString(record.location, "location"),
    year: asString(record.year, "year"),
    services: asString(record.services, "services"),
    categories,
    thumbnailBg: asString(record.thumbnailBg, "thumbnailBg"),
    thumbnailUrl: asString(record.thumbnailUrl, "thumbnailUrl"),
    thumbnailHoverUrl:
      typeof record.thumbnailHoverUrl === "string" && record.thumbnailHoverUrl.trim().length
        ? record.thumbnailHoverUrl
        : undefined,
    heroImageUrl: typeof record.heroImageUrl === "string" && record.heroImageUrl.trim().length ? record.heroImageUrl : undefined,
    gallery,
    videoUrl: typeof record.videoUrl === "string" && record.videoUrl.trim().length ? record.videoUrl : undefined,
    role: typeof record.role === "string" ? record.role : undefined,
    credits: typeof record.credits === "string" ? record.credits : undefined,
    liveUrl: typeof record.liveUrl === "string" ? record.liveUrl : undefined,
    order: Number(record.order),
  };
}

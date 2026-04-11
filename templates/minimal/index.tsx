import Image from "next/image";
import Link from "next/link";
import BlogMarkdown from "@/components/platform/BlogMarkdown";
import type { BlogData, ProjectData, TemplateProps } from "../types";
import styles from "./minimal.module.css";
import { Nav } from "./Nav";

function isRemote(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

function CoverImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes: string;
}) {
  if (!src) {
    return <div className={styles.heroPlaceholder} aria-hidden />;
  }
  if (isRemote(src)) {
    return <Image src={src} alt={alt} fill className={className} sizes={sizes} />;
  }
  return (
    <Image src={src} alt={alt} fill className={className} sizes={sizes} />
  );
}

function HomeView({ data }: { data: TemplateProps["data"] }) {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroVisual}>
          <CoverImage
            src={data.avatar_url}
            alt={data.display_name}
            className={styles.heroImage}
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div>
          {data.role ? <p className={styles.role}>{data.role}</p> : null}
          <h1 className={styles.title}>{data.display_name}</h1>
          {data.location ? (
            <p className={styles.lede}>{data.location}</p>
          ) : null}
          {data.bio ? <p className={styles.lede}>{data.bio}</p> : null}
        </div>
      </section>

      {data.projects.length ? (
        <>
          <h2 className={styles.sectionTitle}>Selected work</h2>
          <div className={styles.grid}>
            {data.projects.map((project: ProjectData) => (
              <Link
                key={project.slug}
                href={`/u/${data.slug}/work/${project.slug}`}
                className={styles.card}
              >
                <div className={styles.cardImageWrap}>
                  <CoverImage
                    src={project.thumbnail_url}
                    alt={project.title}
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  {project.services ? <p className={styles.cardMeta}>{project.services}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

function WorkIndexView({ data }: { data: TemplateProps["data"] }) {
  if (!data.projects.length) {
    return (
      <>
        <h1 className={styles.title} style={{ marginTop: "1rem" }}>
          Work
        </h1>
        <p className={styles.lede}>No published projects yet.</p>
      </>
    );
  }
  return (
    <>
      <h1 className={styles.title} style={{ marginTop: "1rem" }}>
        Work
      </h1>
      <p className={styles.lede}>Projects and case studies.</p>
      <div className={styles.grid} style={{ marginTop: "2rem" }}>
        {data.projects.map((project: ProjectData) => (
          <Link
            key={project.slug}
            href={`/u/${data.slug}/work/${project.slug}`}
            className={styles.card}
          >
            <div className={styles.cardImageWrap}>
              <CoverImage
                src={project.thumbnail_url}
                alt={project.title}
                className={styles.cardImage}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{project.title}</h2>
              {project.year ? <p className={styles.cardMeta}>{project.year}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function ProjectView({
  data,
  project,
}: {
  data: TemplateProps["data"];
  project: ProjectData;
}) {
  return (
    <>
      <div className={styles.detailHero}>
        <div className={styles.detailHeroImage}>
          <CoverImage
            src={project.hero_image_url ?? project.thumbnail_url}
            alt={project.title}
            className={styles.heroImage}
            sizes="100vw"
          />
        </div>
        <h1 className={styles.detailTitle}>{project.title_display ?? project.title}</h1>
        <p className={styles.detailMeta}>
          {[project.year, project.services].filter(Boolean).join(" · ")}
        </p>
        {project.live_url ? (
          <p className={styles.detailMeta}>
            <a href={project.live_url} className={styles.link} target="_blank" rel="noopener noreferrer">
              View live
            </a>
          </p>
        ) : null}
      </div>
      {project.description ? (
        <div className={styles.prose}>
          {project.description.split("\n\n").map((block, i) => (
            <p key={i}>{block}</p>
          ))}
        </div>
      ) : null}
      {project.gallery.length ? (
        <div className={styles.gallery}>
          {project.gallery.map((url, i) => (
            <div key={`${url}-${i}`} className={styles.galleryItem}>
              <CoverImage
                src={url}
                alt={`${project.title} gallery ${i + 1}`}
                className={styles.heroImage}
                sizes="200px"
              />
            </div>
          ))}
        </div>
      ) : null}
      <p style={{ marginTop: "2rem" }}>
        <Link href={`/u/${data.slug}/work`} className={styles.link}>
          ← All work
        </Link>
      </p>
    </>
  );
}

function AboutView({ data }: { data: TemplateProps["data"] }) {
  return (
    <>
      <h1 className={styles.title} style={{ marginTop: "1rem" }}>
        About
      </h1>
      {data.bio ? (
        <div className={styles.prose} style={{ marginTop: "1.5rem" }}>
          {data.bio.split("\n\n").map((block, i) => (
            <p key={i}>{block}</p>
          ))}
        </div>
      ) : (
        <p className={styles.lede}>More about {data.display_name} coming soon.</p>
      )}

      {data.skills.length ? (
        <>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.chips}>
            {data.skills.map((s) => (
              <span key={`${s.name}-${s.display_order}`} className={styles.chip}>
                {s.name}
                {s.level ? ` · ${s.level}/5` : ""}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {data.experiences.length ? (
        <>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <ul className={styles.list}>
            {data.experiences.map((e) => (
              <li key={`${e.company}-${e.display_order}`} className={styles.listItem}>
                <p className={styles.listItemTitle}>
                  {e.role} · {e.company}
                </p>
                <p className={styles.listItemMeta}>
                  {[e.start_date, e.end_date ?? "Present"].filter(Boolean).join(" — ")}
                </p>
                {e.description ? <p className={styles.prose}>{e.description}</p> : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

function ContactView({ data }: { data: TemplateProps["data"] }) {
  return (
    <>
      <h1 className={styles.title} style={{ marginTop: "1rem" }}>
        Contact
      </h1>
      <ul className={styles.list} style={{ marginTop: "2rem" }}>
        {data.email ? (
          <li className={styles.listItem}>
            <p className={styles.listItemTitle}>Email</p>
            <a href={`mailto:${data.email}`} className={styles.link}>
              {data.email}
            </a>
          </li>
        ) : null}
        {data.phone ? (
          <li className={styles.listItem}>
            <p className={styles.listItemTitle}>Phone</p>
            <a href={`tel:${data.phone.replace(/\s+/g, "")}`} className={styles.link}>
              {data.phone}
            </a>
          </li>
        ) : null}
      </ul>
      {data.social_links.length ? (
        <>
          <h2 className={styles.sectionTitle}>Social</h2>
          <ul className={styles.list}>
            {data.social_links.map((s) => (
              <li key={`${s.url}-${s.display_order}`} className={styles.listItem}>
                <a href={s.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
                <span className={styles.listItemMeta}> · {s.platform}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

function BlogsIndexView({ data }: { data: TemplateProps["data"] }) {
  if (!data.blogs.length) {
    return (
      <>
        <h1 className={styles.title} style={{ marginTop: "1rem" }}>
          Blog
        </h1>
        <p className={styles.lede}>No published posts yet.</p>
      </>
    );
  }
  return (
    <>
      <h1 className={styles.title} style={{ marginTop: "1rem" }}>
        Blog
      </h1>
      <p className={styles.lede}>Articles and notes.</p>
      <ul className={styles.list} style={{ marginTop: "2rem" }}>
        {data.blogs.map((b: BlogData) => (
          <li key={b.slug} className={styles.listItem}>
            <Link href={`/u/${data.slug}/blogs/${b.slug}`} className={styles.postTitle}>
              {b.title}
            </Link>
            {b.published_at ? (
              <p className={styles.listItemMeta}>
                {new Date(b.published_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            ) : null}
            {b.tags.length ? (
              <div className={styles.tagRow}>
                {b.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}

function BlogDetailView({ data, blog }: { data: TemplateProps["data"]; blog: BlogData }) {
  return (
    <>
      <p style={{ marginBottom: "1rem" }}>
        <Link href={`/u/${data.slug}/blogs`} className={styles.link}>
          ← All posts
        </Link>
      </p>
      <article>
        <h1 className={styles.detailTitle}>{blog.title}</h1>
        <p className={styles.detailMeta}>
          {blog.published_at
            ? new Date(blog.published_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null}
          {blog.read_time_mins ? ` · ${blog.read_time_mins} min read` : null}
        </p>
        {blog.cover_image_url ? (
          <div className={styles.detailHeroImage} style={{ marginBottom: "2rem" }}>
            <CoverImage
              src={blog.cover_image_url}
              alt={blog.title}
              className={styles.heroImage}
              sizes="100vw"
            />
          </div>
        ) : null}
        {blog.external_url ? (
          <p className={styles.lede}>
            <a href={blog.external_url} className={styles.link} target="_blank" rel="noopener noreferrer">
              Read on {blog.source}
            </a>
          </p>
        ) : null}
        {blog.content ? (
          <div className={styles.prose} style={{ marginTop: "2rem" }}>
            <BlogMarkdown markdown={blog.content} variant="dark" />
          </div>
        ) : null}
      </article>
    </>
  );
}

export default function MinimalTemplate({
  data,
  view = "home",
  activeProject = null,
  activeBlog = null,
}: TemplateProps) {
  return (
    <div className={styles.root}>
      <Nav slug={data.slug} displayName={data.display_name} view={view} />
      <main className={styles.main}>
        {view === "home" ? <HomeView data={data} /> : null}
        {view === "work" ? <WorkIndexView data={data} /> : null}
        {view === "project" && activeProject ? <ProjectView data={data} project={activeProject} /> : null}
        {view === "about" ? <AboutView data={data} /> : null}
        {view === "contact" ? <ContactView data={data} /> : null}
        {view === "blogs" ? <BlogsIndexView data={data} /> : null}
        {view === "blog" && activeBlog ? <BlogDetailView data={data} blog={activeBlog} /> : null}
        <footer className={styles.footer}>Portfolio powered by minimal template · {data.display_name}</footer>
      </main>
    </div>
  );
}

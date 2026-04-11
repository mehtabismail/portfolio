import { notFound } from "next/navigation";
import {
  getPublishedBlogDataBySlugs,
  getPublishedBlogsForUser,
  getPublishedPortfolioBySlug,
  getPublishedUserBySlug,
  listPublishedPortfolioSlugs,
} from "@/lib/supabase/queries";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import { getTemplate } from "@/templates";

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const client = createSupabasePublicClient();
    const slugs = await listPublishedPortfolioSlugs(client);
    const out: { slug: string; blogSlug: string }[] = [];
    for (const slug of slugs) {
      const user = await getPublishedUserBySlug(slug, client);
      if (!user) continue;
      const blogs = await getPublishedBlogsForUser(user.id, client);
      for (const b of blogs) {
        out.push({ slug, blogSlug: b.slug });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; blogSlug: string }>;
}) {
  const { slug, blogSlug } = await params;
  const blog = await getPublishedBlogDataBySlugs(slug, blogSlug);
  const portfolio = await getPublishedPortfolioBySlug(slug);
  if (!blog || !portfolio) return { title: "Post" };
  return {
    title: `${blog.title} — ${portfolio.display_name}`,
    description: blog.content?.slice(0, 160) ?? undefined,
  };
}

export default async function UserBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; blogSlug: string }>;
}) {
  const { slug, blogSlug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const activeBlog = await getPublishedBlogDataBySlugs(slug, blogSlug);
  if (!activeBlog) notFound();

  const Template = getTemplate(data.template_id);
  return <Template data={data} view="blog" activeBlog={activeBlog} />;
}

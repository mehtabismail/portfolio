import { notFound } from "next/navigation";
import { getPublishedPortfolioBySlug } from "@/lib/supabase/queries";
import { getTemplate } from "@/templates";

export const revalidate = 30;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) return { title: "Blog" };
  return {
    title: `Blog — ${data.display_name}`,
    description: data.seo_description ?? undefined,
  };
}

export default async function UserBlogsIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublishedPortfolioBySlug(slug);
  if (!data) notFound();

  const Template = getTemplate(data.template_id);
  return <Template data={data} view="blogs" />;
}

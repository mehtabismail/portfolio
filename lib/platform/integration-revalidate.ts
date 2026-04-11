import { revalidatePath } from "next/cache";

export function importedBlogSyncRevalidate(portfolioSlug: string): void {
  revalidatePath(`/u/${portfolioSlug}/blogs`);
  revalidatePath("/blogs");
}

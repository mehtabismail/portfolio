import { revalidatePath } from "next/cache";

export function revalidateAllContentPaths() {
  const paths = ["/", "/work", "/about", "/contact", "/archive"];
  paths.forEach((path) => revalidatePath(path));
  revalidatePath("/work/[slug]", "page");
}

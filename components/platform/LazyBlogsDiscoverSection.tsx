"use client";

import dynamic from "next/dynamic";

const BlogsDiscoverSection = dynamic(() => import("./BlogsDiscoverSection"), { ssr: false });

export default function LazyBlogsDiscoverSection() {
  return <BlogsDiscoverSection />;
}

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./blog-markdown.module.css";

type Props = {
  markdown: string;
  className?: string;
  /** Dark page background (e.g. minimal template). */
  variant?: "light" | "dark";
};

export default function BlogMarkdown({ markdown, className, variant = "light" }: Props) {
  const skin = variant === "dark" ? ` ${styles.blogMdDark}` : "";
  return (
    <div className={`${styles.blogMd}${skin}${className ? ` ${className}` : ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}

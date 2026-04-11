import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { TemplateProps } from "./types";

export type TemplateId = "minimal";

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  description: string;
  previewImageUrl: string;
  tags: string[];
};

export type { TemplateProps, UserPortfolioData } from "./types";

export const TEMPLATE_META: Record<TemplateId, TemplateMeta> = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean, typography-first. Perfect for designers and developers.",
    previewImageUrl: "/assets/img/home-item-1.jpg",
    tags: ["minimal", "dark", "typography"],
  },
};

export const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<TemplateProps>> = {
  minimal: dynamic(() => import("@/templates/minimal")) as ComponentType<TemplateProps>,
};

export function getTemplate(id: string): ComponentType<TemplateProps> {
  return TEMPLATE_COMPONENTS[id as TemplateId] ?? TEMPLATE_COMPONENTS.minimal;
}

import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { providerSchema } from "./data/providerSchema";
import { legacyRoutes } from "./data/legacyRoutes";
import { topicRoutes } from "./data/topics";

const providers = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/content/providers" }),
  schema: providerSchema,
});

const topicPaths = topicRoutes.map((route) => route.path);
const relatedPaths = legacyRoutes.map((route) => route.path);
const topics = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/topics" }),
  schema: z.object({
    legacyPath: z.string().refine((path) => topicPaths.includes(path), "Unknown historical topic route"),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((date) => Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date, "Invalid content date"),
    providers: z.array(z.object({
      provider: reference("providers"),
      relationship: z.enum(["direct", "alternative"]),
      note: z.string().min(1).optional(),
    })).refine((recommendations) => new Set(recommendations.map((entry) => entry.provider.id)).size === recommendations.length, "Duplicate provider reference"),
    related: z.array(z.string().refine((path) => relatedPaths.includes(path), "Unknown related topic")).min(2).max(4),
  }).refine((topic) => !topic.related.includes(topic.legacyPath) && new Set(topic.related).size === topic.related.length, "Related routes must be unique and exclude the current topic"),
});

export const collections = { providers, topics };

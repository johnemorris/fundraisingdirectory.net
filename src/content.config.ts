import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { providerSchema } from "./data/providerSchema";

const providers = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/content/providers" }),
  schema: providerSchema,
});

export const collections = { providers };

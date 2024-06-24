import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  spec: {
    url: "/.well-known/ai-plugin.json",
  },
  theme: "purple",
  metaData: {
    title: "Ref Agent API",
    description: "Ref Finance Agent API reference",
    ogDescription: "Ref Finance Agent API reference",
    ogTitle: "Ref Agent API",
    ogImage:
      "https://lvjt7wkmlmpwhrpm.public.blob.vercel-storage.com/Screenshot%202024-06-24%20at%205.45.29%E2%80%AFAM-2FKJVtJLsflUdSeI4TmdZGbBIn9P1z.png",
    twitterCard: "summary_large_image",
  },
} as const;

export const GET = ApiReference(config);

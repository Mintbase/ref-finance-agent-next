import Fuse, { type IFuseOptions } from "fuse.js";

import { ALLOWLISTED_TOKENS, type AllowlistedToken } from "@/utils/allowlist-tokens";

const options: IFuseOptions<AllowlistedToken> = {
  includeScore: true,
  keys: [
    { name: "name", weight: 0.5 },
    { name: "symbol", weight: 0.3 },
    { name: "id", weight: 0.2 },
  ],
  isCaseSensitive: false,
  ignoreLocation: false,
  distance: 10,
  threshold: 0.1,
};

const tokens = Object.values(ALLOWLISTED_TOKENS);
const fuse = new Fuse(tokens, options);

export const searchToken = (query: string): AllowlistedToken[] => {
  if (query.toLowerCase() === "near") {
    query = "wrap.near"; // always convert NEAR -> wNEAR
  }

  const result = fuse.search(query);

  return result.map((res) => res.item);
};

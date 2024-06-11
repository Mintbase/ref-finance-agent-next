import Fuse, { IFuseOptions } from "fuse.js";
import { WhitelistedToken, whitelistedTokens } from "@/utils/whitelist-tokens";

// Create an array of tokens
const tokens = Object.values(whitelistedTokens);

// Set up the fuse.js options
const options: IFuseOptions<WhitelistedToken> = {
  includeScore: true,
  keys: [
    { name: "name", weight: 0.5 },
    { name: "symbol", weight: 0.3 },
    { name: "id", weight: 0.2 },
  ],
  isCaseSensitive: false,
  threshold: 0.3, // Adjust the threshold for the desired level of fuzziness
};

// Create a new fuse instance
const fuse = new Fuse(tokens, options);

export const searchToken = (query: string): WhitelistedToken[] => {
  if (query.toLowerCase() === "near") {
    query = "wrap.near"; // Special case for NEAR
  }
  // Search the tokens with the query
  const result = fuse.search(query);

  // Map the result to only return the tokens
  return result.map((res) => res.item);
};

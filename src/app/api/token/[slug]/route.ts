import { NextRequest, NextResponse } from "next/server";

import { ftGetTokenMetadata } from "@ref-finance/ref-sdk";

import { searchToken } from "@/utils/search-token";

export const maxDuration = 60; // 60 seconds

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const { slug: tokenQuery } = params;
  const tokenMatch = searchToken(tokenQuery)[0];
  const tokenMetadata = await ftGetTokenMetadata(tokenMatch.id);

  if (!tokenMetadata) {
    return NextResponse.json({ error: `Failed to fetch metadata for token: ${tokenQuery}` });
  }

  return NextResponse.json(tokenMetadata);
};

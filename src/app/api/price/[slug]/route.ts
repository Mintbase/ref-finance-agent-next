import { NextRequest, NextResponse } from "next/server";

import { searchToken } from "@/utils/search-token";

export const maxDuration = 60 // 60 seconds

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const { slug: tokenQuery } = params;
  const tokenMatch = searchToken(tokenQuery)[0];
  if (!tokenMatch) {
    return NextResponse.json({ error: `Unable to find token: ${tokenQuery}` });
  }
  const priceResponse = await fetch(`https://api.ref.finance/get-token-price?token_id=${tokenMatch.id}`).then((res) =>
    res.json()
  );
  const price = priceResponse?.price;

  if (!price) {
    return NextResponse.json({ error: `Failed to fetch price for token: ${tokenQuery}` });
  }

  return NextResponse.json({ price });
};

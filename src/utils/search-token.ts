import { WhitelistedToken, whitelistedTokens } from "@/utils/whitelist-tokens";

interface ScoredToken {
    token: WhitelistedToken;
    score: number;
}
export const searchToken = (query: string): WhitelistedToken[] => {
    const whitelistMetadata: Record<string, WhitelistedToken> =
        whitelistedTokens;

    if (!whitelistMetadata) {
        return [];
    }

    function normalize(text: string): string {
        return text.toLowerCase().replace(/[^\w\s.]/gi, ""); // Remove non-alphanumeric characters except space and period
    }

    function tokenize(text: string): string[] {
        return normalize(text).split(/\s+/);
    }

    function searchTokens(_query: string): WhitelistedToken[] {
        const query = normalize(_query);

        const queryTokens = tokenize(query);
        const tokenScores: ScoredToken[] = [];

        Object.values(whitelistMetadata).forEach((token) => {
            const nameTokens = tokenize(token.name);
            const symbolTokens = tokenize(token.symbol);
            const idTokens = tokenize(token.id);
            let score = 0;

            queryTokens.forEach((queryToken) => {
                const nameMatches = nameTokens.filter((nameToken) =>
                    nameToken.includes(queryToken)
                ).length;
                const symbolMatches = symbolTokens.filter((symbolToken) =>
                    symbolToken.includes(queryToken)
                ).length;
                const idMatches = idTokens.filter((idToken) =>
                    idToken.includes(queryToken)
                ).length;

                // Exact match scoring
                const exactNameMatchBonus = nameTokens.includes(queryToken)
                    ? 10
                    : 0;
                const exactSymbolMatchBonus = symbolTokens.includes(queryToken)
                    ? 20
                    : 0;

                // Weight the matches, potentially giving different weights to different types of matches
                score +=
                    nameMatches +
                    symbolMatches * 2 +
                    idMatches * 3 +
                    exactNameMatchBonus +
                    exactSymbolMatchBonus;
            });

            if (score > 0) {
                tokenScores.push({ token, score });
            }
        });

        // Sort results by score in descending order and return only the token objects
        return tokenScores.sort((a, b) => b.score - a.score).map(entry => entry.token);
    }

    return searchTokens(query);
}

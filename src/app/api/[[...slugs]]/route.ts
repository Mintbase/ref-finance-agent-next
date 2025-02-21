import { swagger } from "@elysiajs/swagger";
import {
  WRAP_NEAR_CONTRACT_ID,
  estimateSwap,
  fetchAllPools,
  ftGetTokenMetadata,
  getStablePools,
  instantSwap,
  nearDepositTransaction,
  nearWithdrawTransaction,
  transformTransactions,
  type EstimateSwapView,
  type Pool,
  type Transaction,
  type TransformedTransaction,
} from "@ref-finance/ref-sdk";
import { Elysia } from "elysia";

import { searchToken } from "@/utils/search-token";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const app = new Elysia({ prefix: "/api", aot: false })
  .use(swagger())
  .get("/:token", async ({ params: { token } }) => {
    const tokenMatch = searchToken(token)[0];
    if (!tokenMatch) {
      return {
        error: `Token ${token} not found`,
      };
    }
    const tokenMetadata = await ftGetTokenMetadata(tokenMatch.id);
    if (!tokenMetadata) {
      return {
        error: `Metadata for token ${token} not found`,
      };
    }

    return {
      ...tokenMetadata,
      icon: "",
    };
  })
  .get(
    "/swap/:tokenIn/:tokenOut/:quantity",
    async ({
      params: { tokenIn, tokenOut, quantity },
      headers,
    }): Promise<TransformedTransaction[] | { error: string }> => {
      const mbMetadata: { accountId: string } | undefined =
        headers["mb-metadata"] && JSON.parse(headers["mb-metadata"]);
      const accountId = mbMetadata?.accountId || "near";

      const { ratedPools, unRatedPools, simplePools } = await fetchAllPools();

      const stablePools: Pool[] = unRatedPools.concat(ratedPools);

      // remove low liquidity DEGEN_SWAP pools
      const nonDegenStablePools = stablePools.filter(
        (pool) => pool.pool_kind !== "DEGEN_SWAP"
      );

      const nonDegenStablePoolsDetails = await getStablePools(
        nonDegenStablePools
      );

      const isNearIn = tokenIn.toLowerCase() === "near";
      const isNearOut = tokenOut.toLowerCase() === "near";

      const tokenInMatch = searchToken(tokenIn)[0];
      const tokenOutMatch = searchToken(tokenOut)[0];

      if (!tokenInMatch || !tokenOutMatch) {
        return {
          error: `Unable to find token(s) tokenInMatch: ${tokenInMatch?.name} tokenOutMatch: ${tokenOutMatch?.name}`,
        };
      }

      const [tokenInData, tokenOutData] = await Promise.all([
        ftGetTokenMetadata(tokenInMatch.id),
        ftGetTokenMetadata(tokenOutMatch.id),
      ]);

      if (tokenInData.id === WRAP_NEAR_CONTRACT_ID && isNearOut) {
        return transformTransactions(
          [nearWithdrawTransaction(quantity)],
          accountId
        );
      }

      if (isNearIn && tokenOutData.id === WRAP_NEAR_CONTRACT_ID) {
        return transformTransactions(
          [nearDepositTransaction(quantity)],
          accountId
        );
      }

      if (tokenInData.id === tokenOutData.id && isNearIn === isNearOut) {
        return { error: "TokenIn and TokenOut cannot be the same" };
      }

      const refEstimateSwap = (enableSmartRouting: boolean) => {
        return estimateSwap({
          tokenIn: tokenInData,
          tokenOut: tokenOutData,
          amountIn: quantity,
          simplePools,
          options: {
            enableSmartRouting,
            stablePools: nonDegenStablePools,
            stablePoolsDetail: nonDegenStablePoolsDetails,
          },
        });
      };

      const swapTodos: EstimateSwapView[] = await refEstimateSwap(true).catch(
        () => {
          return refEstimateSwap(false); // fallback to non-smart routing if unsupported
        }
      );

      const transactionsRef: Transaction[] = await instantSwap({
        tokenIn: tokenInData,
        tokenOut: tokenOutData,
        amountIn: quantity,
        swapTodos,
        slippageTolerance: 0.1, // 1% slippage tolerance
        AccountId: accountId,
        referralId: "mintbase.near",
      });

      if (isNearIn) {
        // wrap near
        transactionsRef.splice(-1, 0, nearDepositTransaction(quantity));
      }

      if (isNearOut) {
        // unwrap near
        const lastFunctionCall = transactionsRef[transactionsRef.length - 1]
          .functionCalls[0] as {
          args: {
            msg: string;
          };
        };
        const parsedActions = JSON.parse(lastFunctionCall.args.msg);
        parsedActions["skip_unwrap_near"] = false;
        lastFunctionCall.args.msg = JSON.stringify(parsedActions);
      }

      return transformTransactions(transactionsRef, accountId);
    }
  )
  .compile();

export const GET = app.handle;
export const POST = app.handle;

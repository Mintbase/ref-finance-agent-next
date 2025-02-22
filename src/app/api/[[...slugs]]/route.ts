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
  type TransformedTransaction,
} from "@ref-finance/ref-sdk";
import { Elysia } from "elysia";

import { searchToken } from "@/utils/search-token";
import { getSlippageTolerance } from "@/utils/slippage";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const REFERRAL_ID = "bitte.near";

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
      query: { slippage },
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

      const slippageTolerance = getSlippageTolerance(slippage);

      const refSwapTransactions = await instantSwap({
        tokenIn: tokenInData,
        tokenOut: tokenOutData,
        amountIn: quantity,
        swapTodos,
        slippageTolerance,
        AccountId: accountId,
        referralId: REFERRAL_ID,
      });

      if (isNearIn) {
        // wrap near
        refSwapTransactions.unshift(nearDepositTransaction(quantity));
      }

      if (isNearOut) {
        const lastFunctionCall = refSwapTransactions
          .at(-1)
          ?.functionCalls.at(-1);

        const args = lastFunctionCall?.args;

        if (args && "msg" in args && typeof args.msg === "string") {
          const argsMsgObj = JSON.parse(args.msg);

          argsMsgObj.skip_unwrap_near = false;

          lastFunctionCall.args = {
            ...lastFunctionCall.args,
            msg: JSON.stringify(argsMsgObj),
          };
        }
      }
      return transformTransactions(refSwapTransactions, accountId);
    }
  )
  .compile();

export const GET = app.handle;
export const POST = app.handle;

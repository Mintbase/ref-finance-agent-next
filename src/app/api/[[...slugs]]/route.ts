import { swagger } from "@elysiajs/swagger";
import {
  WRAP_NEAR_CONTRACT_ID,
  estimateSwap,
  fetchAllPools,
  ftGetTokenMetadata,
  getStablePools,
  nearDepositTransaction,
  nearWithdrawTransaction,
  transformTransactions,
  type EstimateSwapView,
  type Pool,
  type TransformedTransaction
} from "@ref-finance/ref-sdk";
import { Elysia } from "elysia";

import { getBestSwapTransactions } from "@/app/lib/best-swap-finder";
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
      query: {
        slippage
      },
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

      const refSwapTransactions = await getBestSwapTransactions({
        swapTodos,
        tokenIn: tokenInData,
        tokenOut: tokenOutData,
        amountIn: quantity,
        slippageTolerance,
        AccountId: accountId,
        referralId: REFERRAL_ID,
      })


      // add wrap near transaction
      if (isNearIn) {
        refSwapTransactions.unshift(nearDepositTransaction(quantity));
      }

      const lastTransaction = refSwapTransactions.at(-1);
      const lastFunctionCall = lastTransaction?.functionCalls.at(-1);

      if (lastFunctionCall?.args &&
        typeof lastFunctionCall.args === 'object' &&
        'msg' in lastFunctionCall.args &&
        typeof lastFunctionCall.args.msg === 'string') {

        const lastFunctionCallMsgObj = JSON.parse(lastFunctionCall.args.msg);

        const isDclSwap = "Swap" in lastFunctionCallMsgObj;

        if (isDclSwap) {
          lastFunctionCallMsgObj.Swap.client_id = REFERRAL_ID;
          // Set skip_unwrap_near for wrap.near output (dclSwaps unwrap by default)
          if (tokenOutData.id === WRAP_NEAR_CONTRACT_ID && !isNearOut) {
            lastFunctionCallMsgObj.Swap.skip_unwrap_near = true;
          }

          // Set skip_unwrap_near for non-dcl swaps with near out
        } else if (isNearOut) {
          lastFunctionCallMsgObj.skip_unwrap_near = false;
        }


        lastFunctionCall.args = {
          ...lastFunctionCall.args,
          msg: JSON.stringify(lastFunctionCallMsgObj)
        };
      }

      return transformTransactions(refSwapTransactions, accountId);
    }
  )
  .compile();

export const GET = app.handle;
export const POST = app.handle;
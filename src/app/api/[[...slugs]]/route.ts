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
  toReadableNumber,
  transformTransactions,
  type EstimateSwapView,
  type Transaction,
  type TransformedTransaction,
} from "@ref-finance/ref-sdk";
import { Elysia } from "elysia";

import { searchToken } from "@/utils/search-token";

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

      const stablePools = unRatedPools.concat(ratedPools);

      const stablePoolsDetail = await getStablePools(stablePools);

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
            stablePools,
            stablePoolsDetail,
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
        slippageTolerance: 0.05,
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
        const lastAction =
          parsedActions.actions[parsedActions.actions.length - 1];
        const amountOut = lastAction.min_amount_out;

        const formattedAmountOut = toReadableNumber(
          tokenOutData.decimals,
          amountOut
        );

        const nearWithdrawTx = nearWithdrawTransaction(formattedAmountOut);
        transactionsRef.push(nearWithdrawTx);
      }

      return transformTransactions(transactionsRef, accountId);
    }
  )
  .compile();

export const GET = app.handle;
export const POST = app.handle;

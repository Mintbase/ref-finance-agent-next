import { searchToken } from "@/utils/search-token";
import { swagger } from '@elysiajs/swagger';
import { EstimateSwapView, Transaction, WRAP_NEAR_CONTRACT_ID, estimateSwap, fetchAllPools, ftGetTokenMetadata, init_env, instantSwap, nearDepositTransaction, nearWithdrawTransaction, percentLess, scientificNotationToString, separateRoutes } from "@ref-finance/ref-sdk"
import { Elysia } from "elysia";

// @ts-ignore
import Big from 'big.js';

init_env("mainnet")

const app = new Elysia({ prefix: '/api', aot: false })
    .use(swagger())
    .get("/:token", async ({ params: { token } }) => {
        const _tokenIn = await searchToken(token)
        const tokenMetadata = await ftGetTokenMetadata(_tokenIn[0].id);
        return {
            ...tokenMetadata,
            icon: ""
        };
    })
    .get("/swap/:tokenIn/:tokenOut/:quantity", async ({ params: { tokenIn, tokenOut, quantity }, headers }) => {
        const mbMetadata = JSON.parse(headers["mb-metadata"] || "{}")
        const accountId = mbMetadata?.accountData?.accountId || "near"

        const { simplePools } = await fetchAllPools();

        const _tokenIn = await searchToken(tokenIn)
        const _tokenOut = await searchToken(tokenOut)

        if (_tokenIn.length === 0 || _tokenOut.length === 0) {
            return "Token not found"
        }

        const tokenInId = _tokenIn[0]?.id || undefined
        const tokenOutId = _tokenOut[0]?.id || undefined

        if (!tokenInId || !tokenOutId) {
            return "Token not found"
        }

        const tokenInData = await ftGetTokenMetadata(tokenInId);
        const tokenOutData = await ftGetTokenMetadata(tokenOutId);

        const swapTodos: EstimateSwapView[] = await estimateSwap({
            tokenIn: tokenInData,
            tokenOut: tokenOutData,
            amountIn: quantity,
            simplePools,
            options: {
                enableSmartRouting: true
            }
        });

        const transactionsRef: Transaction[] = await instantSwap({
            tokenIn: tokenInData,
            tokenOut: tokenOutData,
            amountIn: quantity,
            swapTodos,
            slippageTolerance: 0.01,
            AccountId: accountId,
            referralId: "mintbase.near"
        });

        if (tokenIn && tokenInData.id === WRAP_NEAR_CONTRACT_ID) {
            transactionsRef.splice(-1, 0, nearDepositTransaction(quantity));
          }

          if (tokenOut && tokenOutData.id === WRAP_NEAR_CONTRACT_ID) {
            let outEstimate = new Big(0);
            const routes = separateRoutes(swapTodos, tokenOutData.id);
      
            const bigEstimate = routes.reduce((acc, cur) => {
              const curEstimate = cur[cur.length - 1].estimate;
              return acc.plus(curEstimate);
            }, outEstimate);
      
            const minAmountOut = percentLess(
              0.01,
      
              scientificNotationToString(bigEstimate.toString())
            );
      
            transactionsRef.push(nearWithdrawTransaction(minAmountOut));
          }

        return transactionsRef;
    })
    .compile()


export const GET = app.handle
export const POST = app.handle
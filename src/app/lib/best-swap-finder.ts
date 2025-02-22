import { hasValidDclPool } from "@/utils/allowlist-dcl-pools";
import { DCLSwapByInputOnBestPool, instantSwap, type Transaction } from "@ref-finance/ref-sdk";

type ParsedSwapArgsMsg =
  {
    Swap: {
      min_amount_out: string;
      min_output_amount: string;
      client_id?: string;
      skip_unwrap_near?: boolean;
    }
  } | {
    force: number;
    actions: {
      pool_id: number;
      token_in: string;
      token_out: string;
      amount_in: string;
      min_amount_out: string;
    }[];
    referral_id?: string;
    skip_unwrap_near?: boolean;
  }

const getMinAmountOut = (transactions: Transaction[]): bigint => {
  const lastFunctionCall = transactions.at(-1)?.functionCalls.at(-1);
  if (!lastFunctionCall?.args) return 0n;

  const { args } = lastFunctionCall;
  if (!('msg' in args) || typeof args.msg !== 'string') return 0n;

  const parsedMsg = JSON.parse(args.msg) as ParsedSwapArgsMsg;

  if ('Swap' in parsedMsg) {
    return BigInt(parsedMsg.Swap.min_output_amount);
  }

  return parsedMsg.actions.reduce(
    (total, { min_amount_out }) => total + BigInt(min_amount_out),
    0n
  );
};

type GetBestSwapTransactionsParams = Parameters<typeof instantSwap>[0]

// Get the best swap between instantSwap (Ref V1) and DCLSwap (Ref V2)
export const getBestSwapTransactions = async (params: GetBestSwapTransactionsParams): Promise<Transaction[]> => {
  const refInstantSwapTransactions = await instantSwap(params);

  const { tokenIn, tokenOut, amountIn, slippageTolerance, AccountId } = params;

  const hasDclPool = hasValidDclPool(tokenIn.id, tokenOut.id);

  const refDclSwapTransactions: Transaction[] | undefined = hasDclPool
    ? await DCLSwapByInputOnBestPool({
      tokenA: tokenIn,
      tokenB: tokenOut,
      amountA: amountIn,
      slippageTolerance,
      AccountId
    }).catch(() => {
      // ignore expected errors for some pools
      return undefined;
    })
    : undefined;


  if (!refDclSwapTransactions || refDclSwapTransactions.length === 0) {
    return refInstantSwapTransactions;
  }

  // Get the minimumAmountOut from the last function call in the transactions
  const instantSwapMinAmountOut = getMinAmountOut(refInstantSwapTransactions);
  const dclSwapMinAmountOut = getMinAmountOut(refDclSwapTransactions);


  const isDclSwapBetter = dclSwapMinAmountOut > instantSwapMinAmountOut;

  if (isDclSwapBetter) {
    return refDclSwapTransactions;
  }

  return refInstantSwapTransactions;
}
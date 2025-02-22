import { listDCLPools } from "@ref-finance/ref-sdk";

interface DCLPoolInfo {
  pool_id: string;
  token_x: string;
  token_y: string;
  fee: number;
  point_delta: number;
  current_point: number;
  liquidity: string;
  liquidity_x: string;
  max_liquidity_per_point: string;
  total_fee_x_charged: string;
  total_fee_y_charged: string;
  volume_x_in: string;
  volume_y_in: string;
  volume_x_out: string;
  volume_y_out: string;
  total_liquidity: string;
  total_order_x: string;
  total_order_y: string;
  total_x: string;
  total_y: string;
  state: string;
}

// Snapshot from Feb 22, 2025 using getValidDclPools
export const VALID_DCL_POOLS: DCLPoolInfo[] = [
  {
    pool_id:
      "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near|wrap.near|2000",
    token_x: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
    token_y: "wrap.near",
    fee: 2000,
    point_delta: 40,
    current_point: 402164,
    liquidity: "934203192048889",
    liquidity_x: "586800134372543",
    max_liquidity_per_point: "8506846501860915063707772491481918",
    total_fee_x_charged: "5716322072",
    total_fee_y_charged: "2452451210669213895410141153",
    volume_x_in: "14290866995471",
    volume_y_in: "6116322032108979854529209452770",
    volume_x_out: "13061284614202",
    volume_y_out: "6767426222620597983682351310405",
    total_liquidity: "2474795516491685",
    total_order_x: "8945917778",
    total_order_y: "1324069813516567519566821329",
    total_x: "37948040699",
    total_y: "5870999451597612461076651088",
    state: "Running",
  },
  {
    pool_id:
      "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near|aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near|2000",
    token_x: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
    token_y: "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near",
    fee: 2000,
    point_delta: 40,
    current_point: 289041,
    liquidity: "1029984100",
    liquidity_x: "1029984100",
    max_liquidity_per_point: "8506846501860915063707772491481918",
    total_fee_x_charged: "29053551",
    total_fee_y_charged: "157799990786616553054",
    volume_x_in: "62929682379",
    volume_y_in: "394499976966541384212611",
    volume_x_out: "41410166869",
    volume_y_out: "503095255631662833291278",
    total_liquidity: "14601452210",
    total_order_x: "295191599",
    total_order_y: "7563220111141211316162",
    total_x: "9498758177",
    total_y: "7866254128751546405254",
    state: "Running",
  },
  {
    pool_id: "usdt.tether-token.near|wrap.near|2000",
    token_x: "usdt.tether-token.near",
    token_y: "wrap.near",
    fee: 2000,
    point_delta: 40,
    current_point: 402145,
    liquidity: "6243771896425577",
    liquidity_x: "906868901024590",
    max_liquidity_per_point: "8506846501860915063707772491481918",
    total_fee_x_charged: "10513879625",
    total_fee_y_charged: "1983546670575054233961731230",
    volume_x_in: "26284048973111",
    volume_y_in: "4958866676437635584904377187531",
    volume_x_out: "26755534418994",
    volume_y_out: "4838338527997107076357552139958",
    total_liquidity: "63447567330599744",
    total_order_x: "60000000",
    total_order_y: "292860000000000000000000000",
    total_x: "48462772396",
    total_y: "158610935704708116411287042483",
    state: "Running",
  },
  {
    pool_id:
      "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1|wrap.near|2000",
    token_x: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    token_y: "wrap.near",
    fee: 2000,
    point_delta: 40,
    current_point: 402140,
    liquidity: "7298324205424208",
    liquidity_x: "7167058722935201",
    max_liquidity_per_point: "8506846501860915063707772491481918",
    total_fee_x_charged: "10630782188",
    total_fee_y_charged: "2207920818276242421362830094",
    volume_x_in: "171017044978726",
    volume_y_in: "32712293593587426244202423171239",
    volume_x_out: "171655455709862",
    volume_y_out: "32466453941517885901277148972910",
    total_liquidity: "11754851918498191",
    total_order_x: "314243",
    total_order_y: "8571200000000000000000000000",
    total_x: "111671945563",
    total_y: "44740753581801558698989383352",
    state: "Running",
  },
  {
    pool_id: "aurora|wrap.near|2000",
    token_x: "aurora",
    token_y: "wrap.near",
    fee: 2000,
    point_delta: 40,
    current_point: 203979,
    liquidity: "3282231514353122",
    liquidity_x: "846494861793166",
    max_liquidity_per_point: "8506846501860915063707772491481918",
    total_fee_x_charged: "5156549901814",
    total_fee_y_charged: "3447868875390240071989",
    volume_x_in: "12891374754566484",
    volume_y_in: "8619672188475600180006432",
    volume_x_out: "15332799209979706",
    volume_y_out: "7111088651538019950824034",
    total_liquidity: "218511129714519758",
    total_order_x: "0",
    total_order_y: "10000000000000000000000",
    total_x: "8570556652846",
    total_y: "4120367191471230758560284",
    state: "Running",
  },
  {
    pool_id:
      "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1|blackdragon.tkn.near|2000",
    token_x: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    token_y: "blackdragon.tkn.near",
    fee: 2000,
    point_delta: 40,
    current_point: 579560,
    liquidity: "159510973010170",
    liquidity_x: "159510973010170",
    max_liquidity_per_point: "8506846501860915063707772491481918",
    total_fee_x_charged: "0",
    total_fee_y_charged: "5911906941710782378455650901",
    volume_x_in: "0",
    volume_y_in: "14779767354276955946139127266230",
    volume_x_out: "1000407",
    volume_y_out: "0",
    total_liquidity: "503888524317498",
    total_order_x: "12907",
    total_order_y: "939334166514542164386396430804460",
    total_x: "52057",
    total_y: "954828601443257120383630586346184",
    state: "Running",
  },
  {
    pool_id:
      "802d89b6e511b335f05024a65161bce7efc3f311.factory.bridge.near|wrap.near|2000",
    token_x: "802d89b6e511b335f05024a65161bce7efc3f311.factory.bridge.near",
    token_y: "wrap.near",
    fee: 2000,
    point_delta: 40,
    current_point: 67091,
    liquidity: "57596116466767285228",
    liquidity_x: "51573959874797420480",
    max_liquidity_per_point: "8506846501860915063707772491481918",
    total_fee_x_charged: "4663083057136868634",
    total_fee_y_charged: "4779320588248400000000",
    volume_x_in: "11657707642842171595358",
    volume_y_in: "11948301470620999999999796",
    volume_x_out: "12299958604528304108517",
    volume_y_out: "11387831274391705690028621",
    total_liquidity: "57596116466767285228",
    total_order_x: "0",
    total_order_y: "0",
    total_x: "13435738785940451669944",
    total_y: "7941270951644672309923540",
    state: "Running",
  },
  {
    pool_id:
      "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1|wrap.near|100",
    token_x: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    token_y: "wrap.near",
    fee: 100,
    point_delta: 1,
    current_point: 402135,
    liquidity: "80546406644732521",
    liquidity_x: "50493492449858877",
    max_liquidity_per_point: "212676346402870037870835460372692",
    total_fee_x_charged: "1899473728",
    total_fee_y_charged: "461006046983714780876589046",
    volume_x_in: "94974909296785",
    volume_y_in: "23049757771399258712694212261917",
    volume_x_out: "96383676583332",
    volume_y_out: "22733549185853914758231036387217",
    total_liquidity: "492779401499816349",
    total_order_x: "7743983573",
    total_order_y: "1403002000000000000000000000",
    total_x: "966124695232",
    total_y: "507992623208645840974983699438",
    state: "Running",
  },
  {
    pool_id: "jumptoken.jumpfinance.near|pre.meteor-token.near|10000",
    token_x: "jumptoken.jumpfinance.near",
    token_y: "pre.meteor-token.near",
    fee: 10000,
    point_delta: 200,
    current_point: -242286,
    liquidity: "1567795695295",
    liquidity_x: "1499769088372",
    max_liquidity_per_point: "42529979617665099795447395004595452",
    total_fee_x_charged: "0",
    total_fee_y_charged: "400000",
    volume_x_in: "0",
    volume_y_in: "200000000",
    volume_x_out: "6591838145106974388",
    volume_y_out: "0",
    total_liquidity: "4863953709111",
    total_order_x: "0",
    total_order_y: "0",
    total_x: "321592924672897153620",
    total_y: "10775235116",
    state: "Running",
  },
  {
    pool_id: "mi-1319.meme-cooking.near|usdt.tether-token.near|400",
    token_x: "mi-1319.meme-cooking.near",
    token_y: "usdt.tether-token.near",
    fee: 400,
    point_delta: 8,
    current_point: -418781,
    liquidity: "142532635994",
    liquidity_x: "68160463775",
    max_liquidity_per_point: "1701403327588054377044987812219779",
    total_fee_x_charged: "0",
    total_fee_y_charged: "101",
    volume_x_in: "0",
    volume_y_in: "1278608",
    volume_x_out: "2480404854680491125167685",
    volume_y_out: "0",
    total_liquidity: "142532635994",
    total_order_x: "0",
    total_order_y: "0",
    total_x: "202524622893641913871967",
    total_y: "528476",
    state: "Running",
  },
  {
    pool_id: "ntdarai.tkn.near|wrap.near|10000",
    token_x: "ntdarai.tkn.near",
    token_y: "wrap.near",
    fee: 10000,
    point_delta: 200,
    current_point: 529621,
    liquidity: "2710618391",
    liquidity_x: "0",
    max_liquidity_per_point: "42529979617665099795447395004595452",
    total_fee_x_charged: "0",
    total_fee_y_charged: "0",
    volume_x_in: "0",
    volume_y_in: "0",
    volume_x_out: "0",
    volume_y_out: "0",
    total_liquidity: "7632147956",
    total_order_x: "0",
    total_order_y: "0",
    total_x: "9",
    total_y: "999999999295038231719849",
    state: "Running",
  },
];

export const getValidDclPools = async (): Promise<DCLPoolInfo[]> => {
  const allDclPools: DCLPoolInfo[] = await listDCLPools();
  return allDclPools.filter((pool) => pool.liquidity !== "0");
};

// Find a valid DCL pool for the given tokens
export const hasValidDclPool = (tokenA: string, tokenB: string): boolean => {
  return VALID_DCL_POOLS.some(
    (pool) =>
      (pool.token_x === tokenA && pool.token_y === tokenB) ||
      (pool.token_x === tokenB && pool.token_y === tokenA)
  );
};

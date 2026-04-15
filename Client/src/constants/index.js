export const COINGECKO_URL = "https://www.coingecko.com";
export const FRANKFURTER_API = "https://api.frankfurter.app/latest?from=USD";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || "";
const API_KEY_PARAM = COINGECKO_API_KEY ? `&x_cg_demo_api_key=${COINGECKO_API_KEY}` : "";

export const COINGECKO_TOP_COINS_API = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false${API_KEY_PARAM}`;

export const getCoinGeckoMarketsUrl = (coinIds) =>
	`${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false${API_KEY_PARAM}`;

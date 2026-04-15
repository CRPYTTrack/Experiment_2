import { useState, useEffect } from "react";
import { getCoinGeckoMarketsUrl } from "../constants";

export default function useCoins(portfolio) {
	const portfolioCoins = Object.keys(portfolio);
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const searchCoins = async () => {
			setLoading(true);
			setError(null);

			if (portfolioCoins.length === 0) {
				setCoins([]);
				setLoading(false);
				return;
			}

			try {
				const coinIds = portfolioCoins.join(",");
				const res = await fetch(getCoinGeckoMarketsUrl(coinIds));
				if (!res.ok) throw new Error("An error occured");
				const data = await res.json();
				setCoins(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		searchCoins();
	}, [portfolio]);

	return { coins, loading, error };
}

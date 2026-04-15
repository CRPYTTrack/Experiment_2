import { useEffect, useState } from "react";
import { getCoinGeckoMarketsUrl } from "../constants";

export default function useWatchlist(watchlist) {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const searchCoins = async () => {
			setLoading(true);
			setError(null);

			if (watchlist.length === 0) {
				setCoins([]);
				setLoading(false);
				return;
			}

			try {
				const coinIds = watchlist.join(",");
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
	}, [watchlist]);

	return {
		coins,
		loading,
		error,
	};
}

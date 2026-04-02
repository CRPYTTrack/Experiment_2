export default function downloadCSV(coins, portfolio) {
	if (
		!coins ||
		!portfolio ||
		coins.length === 0 ||
		Object.keys(portfolio).length === 0
	) {
		return;
	}

	const headers = [
		"Name",
		"Price(USD)",
		"Investment(USD)",
		"Coins Purchased",
		"Current Value(USD)",
		"P/L Value(USD)",
		"P/L %",
	];

	const rows = Object.keys(portfolio)
		.map((coinId) => {
			const coinData = coins.find((c) => c.id === coinId);
			const portfolioData = portfolio[coinId];

			if (!coinData || !portfolioData) return null;

			const currentValue = coinData.current_price * portfolioData.coins;
			const totalInvestment = portfolioData.totalInvestment;
			const profitValue = currentValue - totalInvestment;
			const profitPercentage = (profitValue / totalInvestment) * 100;

			return [
				coinData.name,
				coinData.current_price,
				totalInvestment,
				portfolioData.coins,
				currentValue,
				profitValue,
				profitPercentage,
			].join(",");
		})
		.filter(Boolean);

	const csvContent = [headers.join(","), ...rows].join("\n");
	const blob = new Blob([csvContent], {
		type: "text/csv;charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", "portfolio_report.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

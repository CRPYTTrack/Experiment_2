import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState } from "react";
import Form from "../components/Form";
import PortfolioTable from "../components/PortfolioTable";
import TopCoins from "../components/TopCoins";
import CoinGeckoAttribution from "../components/CoinGeckoAttribution";
import useCoins from "../hooks/useCoins";

const Dashboard = ({
	watchlist,
	toggleWatchlist,
	portfolio,
	form,
	addCoin,
	toggleForm,
	removeCoin,
	coinData,
}) => {
	const portfolioCoins = Object.keys(portfolio);
	const [action, setAction] = useState("");
	const { coins, loading, error } = useCoins(portfolio);

	const handleToggleForm = (coin, actionType) => {
		setAction(actionType);
		toggleForm(coin);
	};

	const totalInvestment = Object.keys(portfolio).reduce((acc, coinId) => {
		return acc + portfolio[coinId].totalInvestment;
	}, 0);

	const currentValue = Object.keys(portfolio).reduce((acc, coinId) => {
		const coinData = coins.find((c) => c.id === coinId);
		if (coinData && portfolio[coinId]) {
			return acc + portfolio[coinId].coins * coinData.current_price;
		}
		return acc;
	}, 0);

	const profit =
		((currentValue - totalInvestment) / totalInvestment) * 100 || 0;

	const formatUsd = (value) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(value);

	return !form ? (
		<div className="bg-slate-100 min-h-screen w-full p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:text-white">
			<div className="max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-start gap-1 sm:gap-3 dark:bg-gray-800">
					<h2 className="text-md sm:text-xl font-semibold text-gray-500 dark:text-white">
						Current Value
					</h2>
					<p className="text-2xl sm:text-4xl font-bold wrap-anywhere">
						{formatUsd(currentValue)}
					</p>
					<div
						className={`flex items-center gap-2 font-semibold ${
							profit < 0 ? "text-red-600" : "text-green-600"
						}`}
					>
						{profit < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
						<span>{profit.toFixed(2)}%</span>
					</div>
				</div>
				<div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-start gap-3 dark:bg-gray-800">
					<h2 className="text-md sm:text-xl font-semibold text-gray-500 dark:text-white">
						Total Investment
					</h2>
					<p className="text-2xl sm:text-4xl font-bold wrap-anywhere">
						{formatUsd(totalInvestment)}
					</p>
				</div>
			</div>
			<TopCoins
				coins={coins}
				loading={loading}
				error={error}
				portfolio={portfolio}
			/>
			<div className="mt-10 mx-auto overflow-x-auto [scrollbar-width:none]">
				<PortfolioTable
					loading={loading}
					error={error}
					coins={coins}
					toggleWatchlist={toggleWatchlist}
					watchlist={watchlist}
					portfolio={portfolio}
					message={
						portfolioCoins.length !== 0
							? ""
							: "No Coins Added To Portfolio"
					}
					toggleForm={handleToggleForm}
					totalInvestment={totalInvestment}
					currentValue={currentValue}
				/>
				<div className="text-center mt-2">
					<CoinGeckoAttribution />
				</div>
			</div>
		</div>
	) : (
		<Form
			title={
				action == "add" ? "Add to Portfolio" : "Remove from Portfolio"
			}
			buttonText={action == "add" ? "Add" : "Remove"}
			coinData={coinData}
			toggleForm={toggleForm}
			action={action == "add" ? addCoin : removeCoin}
			portfolio={portfolio}
		/>
	);
};

export default Dashboard;

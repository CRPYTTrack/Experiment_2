import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { alertsAPI } from "../services/api";
import useTopCoins from "../hooks/useTopCoins";
import { useCurrency } from "../context/CurrencyContext";

const Alerts = () => {
	const [alerts, setAlerts] = useState([]);
	const [loadingAlerts, setLoadingAlerts] = useState(true);
	const [coinId, setCoinId] = useState("bitcoin");
	const [condition, setCondition] = useState("above");
	const [targetPrice, setTargetPrice] = useState("");
	const { coins, loading, error } = useTopCoins();
	const { currency, formatCurrency } = useCurrency();

	const selectedCoin = useMemo(
		() => coins.find((coin) => coin.id === coinId),
		[coins, coinId]
	);

	useEffect(() => {
		const fetchAlerts = async () => {
			setLoadingAlerts(true);
			try {
				const response = await alertsAPI.get();
				setAlerts(response.alerts || []);
			} catch (err) {
				toast.error(
					err?.response?.data?.error ||
						"Failed to load alerts. Please refresh.",
					{
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					}
				);
			} finally {
				setLoadingAlerts(false);
			}
		};

		fetchAlerts();
	}, []);

	useEffect(() => {
		if (!coinId && coins.length > 0) {
			setCoinId(coins[0].id);
		}
	}, [coins, coinId]);

	const handleCreateAlert = async (event) => {
		event.preventDefault();

		if (!selectedCoin) {
			toast.error("Please select a coin.");
			return;
		}

		if (!targetPrice || Number(targetPrice) <= 0) {
			toast.error("Target price must be greater than zero.");
			return;
		}

		try {
			const response = await alertsAPI.add({
				coin_id: selectedCoin.id,
				coin_name: selectedCoin.name,
				coin_image: selectedCoin.image,
				target_price: Number(targetPrice) / currency[1],
				condition,
			});

			if (response.alert) {
				setAlerts((prevAlerts) => [response.alert, ...prevAlerts]);
			}

			setTargetPrice("");
			toast.success("Alert created successfully.");
		} catch (err) {
			toast.error(
				err?.response?.data?.error || "Failed to create alert.",
				{
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
		}
	};

	const handleDeleteAlert = async (id) => {
		try {
			await alertsAPI.remove(id);
			setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
			toast.info("Alert deleted.");
		} catch (err) {
			toast.error(
				err?.response?.data?.error || "Failed to delete alert.",
				{
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
		}
	};

	return (
		<div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:text-white">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800 lg:col-span-1">
					<h2 className="text-xl font-semibold mb-4">Create Price Alert</h2>
					<form className="space-y-4" onSubmit={handleCreateAlert}>
						<div>
							<label className="block text-sm font-medium mb-1">Coin</label>
							<select
								value={coinId}
								onChange={(e) => setCoinId(e.target.value)}
								className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
								disabled={loading || !!error}
							>
								{coins.map((coin) => (
									<option key={coin.id} value={coin.id}>
										{coin.name} ({coin.symbol.toUpperCase()})
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Condition</label>
							<select
								value={condition}
								onChange={(e) => setCondition(e.target.value)}
								className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
							>
								<option value="above">Price goes above</option>
								<option value="below">Price goes below</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Target Price ({currency[0]})</label>
							<input
								type="number"
								step="0.000001"
								min="0"
								value={targetPrice}
								onChange={(e) => setTargetPrice(e.target.value)}
								placeholder="Enter target price"
								className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
							/>
						</div>
						{selectedCoin && (
							<p className="text-sm text-gray-500 dark:text-gray-300">
								Current {selectedCoin.name} price: {formatCurrency((selectedCoin.current_price ?? 0) * currency[1], 6)}
							</p>
						)}
						<button
							type="submit"
							className="w-full rounded-md bg-blue-600 py-2.5 text-white font-medium hover:bg-blue-700"
							disabled={loading || !!error}
						>
							Create Alert
						</button>
					</form>
				</div>

				<div className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800 lg:col-span-2 overflow-x-auto [scrollbar-width:none]">
					<h2 className="text-xl font-semibold mb-4">Your Alerts</h2>
					<table className="w-full min-w-[560px] text-left">
						<thead>
							<tr className="border-b border-gray-200 dark:border-gray-700">
								<th className="py-2 pr-4 text-sm font-semibold text-gray-500 dark:text-gray-300">Coin</th>
								<th className="py-2 pr-4 text-sm font-semibold text-gray-500 dark:text-gray-300">Condition</th>
								<th className="py-2 pr-4 text-sm font-semibold text-gray-500 dark:text-gray-300">Target</th>
								<th className="py-2 pr-4 text-sm font-semibold text-gray-500 dark:text-gray-300">Created</th>
								<th className="py-2 pr-4 text-sm font-semibold text-gray-500 dark:text-gray-300"></th>
							</tr>
						</thead>
						<tbody>
							{loadingAlerts && (
								<tr>
									<td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-300">
										Loading alerts...
									</td>
								</tr>
							)}
							{!loadingAlerts && alerts.length === 0 && (
								<tr>
									<td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-300">
										No alerts created yet.
									</td>
								</tr>
							)}
							{alerts.map((alert) => (
								<tr key={alert.id} className="border-b border-gray-100 dark:border-gray-700">
									<td className="py-3 pr-4">
										<div className="flex items-center gap-2">
											{alert.coin_image && (
												<img src={alert.coin_image} alt={alert.coin_name} className="w-6 h-6 rounded-full" />
											)}
											<span>{alert.coin_name}</span>
										</div>
									</td>
									<td className="py-3 pr-4 capitalize">{alert.condition}</td>
									<td className="py-3 pr-4">{formatCurrency((alert.target_price ?? 0) * currency[1], 6)}</td>
									<td className="py-3 pr-4">{new Date(alert.created_at).toLocaleString()}</td>
									<td className="py-3 pr-4">
										<button
											type="button"
											className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
											onClick={() => handleDeleteAlert(alert.id)}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Alerts;

import { useCurrency } from "../context/CurrencyContext";

export default function CurrencySelector() {
const { currency, currencyOptions, setCurrencyCode } = useCurrency();

return (
<select
className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
value={currency[0]}
onChange={(e) => setCurrencyCode(e.target.value)}
>
{currencyOptions.map((option) => (
<option key={option.code} value={option.code}>
{option.code}
</option>
))}
</select>
);
}

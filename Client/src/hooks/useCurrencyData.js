import { useEffect, useMemo, useState } from "react";
import { FRANKFURTER_API } from "../constants";

const CURRENCY_OPTIONS = [
{ code: "USD", label: "US Dollar" },
{ code: "EUR", label: "Euro" },
{ code: "GBP", label: "British Pound" },
{ code: "INR", label: "Indian Rupee" },
{ code: "JPY", label: "Japanese Yen" },
{ code: "AUD", label: "Australian Dollar" },
{ code: "CAD", label: "Canadian Dollar" },
];

export default function useCurrencyData() {
const [selectedCode, setSelectedCode] = useState(
() => localStorage.getItem("currency") || "USD"
);
const [rates, setRates] = useState({ USD: 1 });

useEffect(() => {
let isMounted = true;

const fetchRates = async () => {
try {
const response = await fetch(FRANKFURTER_API);
if (!response.ok) return;
const data = await response.json();
if (!isMounted || !data?.rates) return;
setRates({ USD: 1, ...data.rates });
} catch {
// Keep the default USD rate if exchange API fails.
}
};

fetchRates();
return () => {
isMounted = false;
};
}, []);

const currency = useMemo(() => {
const upper = selectedCode.toUpperCase();
const rate = rates[upper] ?? 1;
return [upper, rate];
}, [selectedCode, rates]);

const setCurrencyCode = (code) => {
const upper = (code || "USD").toUpperCase();
setSelectedCode(upper);
localStorage.setItem("currency", upper);
};

const formatCurrency = (value, maxFractionDigits = 2) => {
const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
return new Intl.NumberFormat("en-US", {
style: "currency",
currency: currency[0],
minimumFractionDigits: 0,
maximumFractionDigits: maxFractionDigits,
}).format(safeValue);
};

return {
currency,
formatCurrency,
currencyOptions: CURRENCY_OPTIONS,
setCurrencyCode,
};
}

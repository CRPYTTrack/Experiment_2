import { createContext, useContext } from "react";
import useCurrencyData from "../hooks/useCurrencyData";

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
const currencyData = useCurrencyData();

return (
<CurrencyContext.Provider value={currencyData}>
{children}
</CurrencyContext.Provider>
);
};

export const useCurrency = () => {
const context = useContext(CurrencyContext);
if (!context) {
throw new Error("useCurrency must be used within a CurrencyProvider");
}
return context;
};

# Feature Removal & Restoration Guide

This document provides **exact line numbers and code changes** needed to remove/restore 5 visual features from the CryptoTrack application for testing purposes.

---

## Quick File Reference

| Feature | Files to Modify | Lines |
|---------|-----------------|-------|
| **Charts (Pie & Bar)** | `Client/src/pages/Dashboard.jsx` | 9-11, 26, 53-106 |
| **Watchlist** | `Client/src/components/CoinRow.jsx` | 1-2, 34-51 |
| | `Client/src/components/Header.jsx` | 78-86 |
| | `Client/src/components/Menu.jsx` | 18-25 |
| **Searchbar** | `Client/src/pages/Home.jsx` | 8, 19-25, 40-44, 49 |
| **Price Alerts** | `Client/src/pages/PriceAlerts.jsx` | Entire file |
| | `Client/src/components/Header.jsx` | ~84-94 |
| | `Client/src/components/Menu.jsx` | ~58-68 |
| | `Client/src/App.jsx` | 16, 28, 37, 53-56, 69-118 |
| **Currency Converter** | `Client/src/main.jsx` | 7, 17-19 |
| | `Client/src/components/Header.jsx` | 4, line with `<CurrencySelector />` |
| | `Client/src/components/BarChartComponent.jsx` | 11, 14, 47 |
| | `Client/src/components/CoinRow.jsx` | 3, 9, 35, 41 |
| | `Client/src/components/PortfolioTable.jsx` | 4, 20, all formatCurrency calls |
| | `Client/src/components/PortfolioCoinRow.jsx` | 3, 12, 36 |
| | `Client/src/components/Form.jsx` | 3, 11, 14, 37 |
| | `Client/src/components/PieChartComponent.jsx` | 10, 24, 50 |
| | `Client/src/pages/Dashboard.jsx` | 8, 26, 58, 74 |
| | `Client/src/pages/PriceAlerts.jsx` | 7, 19, all formatCurrency calls |
| | `Client/src/utils/downloadCSV.js` | 13-17, 35-39 |
| | `Client/src/utils/downloadPDF.js` | 31-35, 53-177 |
| | `Client/src/context/CurrencyContext.jsx` | Delete entire file |
| | `Client/src/components/CurrencySelector.jsx` | Delete entire file |
| | `Client/src/hooks/useCurrencyData.js` | Delete entire file |

---

## Feature 1: Charts (Pie & Bar) - Dashboard

### Files to Modify
**Only 1 file:**
- `Client/src/pages/Dashboard.jsx`

### What Gets Removed
- Portfolio Allocation (Pie Chart visualization)
- Investment vs Current Value (Bar Chart visualization)
- Chart-related imports and data processing

### Deletion Instructions

#### Step 1: Remove Chart Imports
**File**: `Client/src/pages/Dashboard.jsx`
**Lines to delete: 9-11**
```javascript
// DELETE THESE 3 LINES:
import useChart from "../hooks/useChart";
import PieChartComponent from "../components/PieChartComponent";
import BarChartComponent from "../components/BarChartComponent";
```

**Before:**
```javascript
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState } from "react";
import Form from "../components/Form";
import PortfolioTable from "../components/PortfolioTable";
import TopCoins from "../components/TopCoins";
import CoinGeckoAttribution from "../components/CoinGeckoAttribution";
import { useCurrency } from "../context/CurrencyContext";
import useCoins from "../hooks/useCoins";
import useChart from "../hooks/useChart";                          // DELETE
import PieChartComponent from "../components/PieChartComponent";   // DELETE
import BarChartComponent from "../components/BarChartComponent";   // DELETE
```

**After:**
```javascript
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState } from "react";
import Form from "../components/Form";
import PortfolioTable from "../components/PortfolioTable";
import TopCoins from "../components/TopCoins";
import CoinGeckoAttribution from "../components/CoinGeckoAttribution";
import { useCurrency } from "../context/CurrencyContext";
import useCoins from "../hooks/useCoins";
```

---

#### Step 2: Remove useChart Hook Initialization
**File**: `Client/src/pages/Dashboard.jsx`
**Line to delete: 26**
```javascript
// DELETE THIS LINE (after portfolio and coins are defined):
const chart = useChart(portfolio, coins);
```

**Before:**
```javascript
const portfolioCoins = Object.keys(portfolio);
const [action, setAction] = useState("");
const { currency, formatCurrency } = useCurrency();
const { coins, loading, error } = useCoins(portfolio);
const chart = useChart(portfolio, coins);  // DELETE THIS LINE
```

**After:**
```javascript
const portfolioCoins = Object.keys(portfolio);
const [action, setAction] = useState("");
const { currency, formatCurrency } = useCurrency();
const { coins, loading, error } = useCoins(portfolio);
```

---

#### Step 3: Remove Both Chart Sections from JSX
**File**: `Client/src/pages/Dashboard.jsx`
**Delete the entire second grid (Lines 53-106)** - Replace with TopCoins only

**Before** (entire section to delete):
```javascript
<div className="max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-500 mb-4 dark:text-white">
            Portfolio Allocation
        </h2>
        <div className="w-full h-80">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <p>Loading Chart...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-full text-red-500">
                    <p>{error}</p>
                </div>
            ) : chart.length > 0 ? (
                <PieChartComponent chart={chart} />
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p>No coins in portfolio to display.</p>
                </div>
            )}
        </div>
    </div>
    <TopCoins
        coins={coins}
        loading={loading}
        error={error}
        portfolio={portfolio}
    />
</div>
<div className="bg-white shadow-lg rounded-xl p-6 mt-8 dark:bg-gray-800 ">
    <h2 className="text-xl font-semibold text-gray-500 mb-4 dark:text-white">
        Investment vs Current Value
    </h2>
    <div className="w-full h-96 overflow-x-auto ">
        {loading ? (
            <div className="flex justify-center items-center h-full">
                <p>Loading Chart...</p>
            </div>
        ) : error ? (
            <div className="flex justify-center items-center h-full text-red-500">
                <p>{error}</p>
            </div>
        ) : chart.length > 0 ? (
            <BarChartComponent chart={chart} />
        ) : (
            <div className="flex justify-center items-center h-full">
                <p>No data to display in chart.</p>
            </div>
        )}
    </div>
</div>
```

**After** (replacement):
```javascript
<TopCoins
    coins={coins}
    loading={loading}
    error={error}
    portfolio={portfolio}
/>
```

### Restoration Instructions
Reverse the deletions by re-adding:
1. The 3 imports back (lines 9-11)
2. The `const chart = useChart(portfolio, coins);` line (line 26)
3. The entire grid section with both pie and bar charts

---

---

## Feature 2: Watchlist Feature

### Files to Modify
**3 files:**
- `Client/src/components/CoinRow.jsx`
- `Client/src/components/Header.jsx`
- `Client/src/components/Menu.jsx`

### What to Remove
| File | What to Delete |
|------|----------------|
| CoinRow.jsx | Star icon imports + watchlist button |
| Header.jsx | Watchlist nav link (desktop menu) |
| Menu.jsx | Watchlist nav link (mobile menu) |

### File 1: CoinRow.jsx

#### Step 1: Remove Star Icon Imports
**File**: `Client/src/components/CoinRow.jsx`
**Lines to delete: 1-2**
```javascript
// DELETE THESE 2 LINES:
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
```

**Before:**
```javascript
import StarOutlineIcon from "@mui/icons-materials/StarOutline";  // DELETE
import StarIcon from "@mui/icons-material/Star";                 // DELETE
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import getColor from "../utils/color";
```

**After:**
```javascript
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import getColor from "../utils/color";
```

---

#### Step 2: Remove Watchlist Star Button from JSX
**File**: `Client/src/components/CoinRow.jsx`
**Lines to delete: 34-51** - Keep only the "Add" button

**Before** (delete the star button section):
```javascript
<td className="px-6 py-4">
    <div className="flex items-center gap-2">
        <button
            className={`cursor-pointer ${
                !isStarred
                    ? "text-gray-400 hover:text-amber-300 transition-all duration-200"
                    : "text-amber-300"
            }`}
            onClick={() => {
                if (isAuthenticated) {
                    toggleWatchlist(coin.id, coin.name);
                } else {
                    toggleForm();
                }
            }}
        >
            {isStarred ? <StarIcon /> : <StarOutlineIcon />}
        </button>
        <button
            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-all duration-200 cursor-pointer"
            onClick={() => {
                toggleForm(coin);
            }}
        >
            Add
        </button>
    </div>
</td>
```

**After** (keep only Add button):
```javascript
<td className="px-6 py-4">
    <div className="flex items-center gap-2">
        <button
            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-all duration-200 cursor-pointer"
            onClick={() => {
                toggleForm(coin);
            }}
        >
            Add
        </button>
    </div>
</td>
```

---

### File 2: Header.jsx

#### Remove Watchlist NavLink
**File**: `Client/src/components/Header.jsx`
**Lines to delete: 78-86** - Remove entire Watchlist navigation section

**Before:**
```javascript
                    </NavLink>
                    <NavLink
                    to="watchlist"              // DELETE START
                    className={({ isActive }) =>
                    `rounded-sm px-3 py-2 text-sm font-medium ${
                    isActive
                    ? "bg-blue-200 text-blue-700 dark:bg-blue-700/20 dark:text-gray-100"
                    : "dark:text-gray-300 dark:hover:text-white dark:hover:bg-blue-500/10 text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                    }`
                    }
                    >
                    Watchlist                  // DELETE END
                    </NavLink>
                <NavLink
                 to="alerts"
```

**After:**
```javascript
                    </NavLink>
                <NavLink
                 to="alerts"
```

---

### File 3: Menu.jsx

#### Remove Watchlist NavLink
**File**: `Client/src/components/Menu.jsx`
**Lines to delete: 18-25** - Remove entire Watchlist navigation section from mobile menu

**Before:**
```javascript
                </NavLink>
                <NavLink              // DELETE START
                to="watchlist"
                className={({ isActive }) =>
                `p-2 w-full font-medium ${
                isActive
                ? "bg-blue-200 text-blue-700 dark:bg-blue-800/50 dark:text-white"
                : "hover:bg-blue-50 text-gray-700 dark:hover:bg-blue-600/10 dark:text-white"
                }`
                }
                >
                Watchlist
                </NavLink>          // DELETE END
            <NavLink
            to="alerts"
```

**After:**
```javascript
                </NavLink>
            <NavLink
            to="alerts"
```

### Restoration Instructions
For each file, re-add the deleted sections:
- **CoinRow.jsx**: Re-add star icon imports and the complete watchlist button
- **Header.jsx**: Re-add the Watchlist NavLink section
- **Menu.jsx**: Re-add the Watchlist NavLink section

---

---

## Feature 3: Searchbar - Home Page

### Files to Modify
**Only 1 file:**
- `Client/src/pages/Home.jsx`

### What Gets Removed
- Search input field for filtering coins
- Search state management
- Coin filtering logic
- Searchbar component import

### Deletion Instructions

#### Step 1: Remove Searchbar Import
**File**: `Client/src/pages/Home.jsx`
**Line to delete: 8**
```javascript
// DELETE THIS LINE:
import Searchbar from "../components/Searchbar";
```

**Before:**
```javascript
import { useState } from "react";
import Table from "../components/Table";
import Form from "../components/Form";
import LoginWarning from "../components/LoginWarning";
import CoinGeckoAttribution from "../components/CoinGeckoAttribution";
import { useAuth } from "../context/AuthContext";
import useTopCoins from "../hooks/useTopCoins";
import Searchbar from "../components/Searchbar";  // DELETE
```

**After:**
```javascript
import { useState } from "react";
import Table from "../components/Table";
import Form from "../components/Form";
import LoginWarning from "../components/LoginWarning";
import CoinGeckoAttribution from "../components/CoinGeckoAttribution";
import { useAuth } from "../context/AuthContext";
import useTopCoins from "../hooks/useTopCoins";
```

---

#### Step 2: Remove Search State and Filter Logic
**File**: `Client/src/pages/Home.jsx`
**Lines to delete: 19-25**
```javascript
// DELETE THESE LINES:
const [search, setSearch] = useState("");

const filteredCoins = coins.filter(
    (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
);
```

**Before:**
```javascript
const { isAuthenticated } = useAuth();
const { coins, loading, error } = useTopCoins();
const [search, setSearch] = useState("");                        // DELETE START

const filteredCoins = coins.filter(
    (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
);                                                               // DELETE END
```

**After:**
```javascript
const { isAuthenticated } = useAuth();
const { coins, loading, error } = useTopCoins();
```

---

#### Step 3: Remove Searchbar JSX Component
**File**: `Client/src/pages/Home.jsx`
**Lines to delete: 40-44**
```javascript
// DELETE THESE LINES:
<Searchbar
    searchValue={search}
    setSearchValue={setSearch}
    placeholder="Search crypto.."
/>
```

**Before:**
```javascript
                    <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400">
                        Stay updated with real-time cryptocurrency prices
                        and track your portfolio.
                    </p>
                    <Searchbar               // DELETE START
                        searchValue={search}
                        setSearchValue={setSearch}
                        placeholder="Search crypto.."
                    />                       // DELETE END
                    <CoinGeckoAttribution />
```

**After:**
```javascript
                    <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400">
                        Stay updated with real-time cryptocurrency prices
                        and track your portfolio.
                    </p>
                    <CoinGeckoAttribution />
```

---

#### Step 4: Update Table Component Props
**File**: `Client/src/pages/Home.jsx`
**Line to modify: 49**
Change `coins={filteredCoins}` to `coins={coins}`

**Before:**
```javascript
                <Table
                    loading={loading}
                    error={error}
                    coins={filteredCoins}   // CHANGE THIS
                    toggleWatchlist={toggleWatchlist}
                    watchlist={watchlist}
                    message={""}
                    toggleForm={toggleForm}
                />
```

**After:**
```javascript
                <Table
                    loading={loading}
                    error={error}
                    coins={coins}           // CHANGED
                    toggleWatchlist={toggleWatchlist}
                    watchlist={watchlist}
                    message={""}
                    toggleForm={toggleForm}
                />
```

### Restoration Instructions
Reverse the deletions by re-adding:
1. The Searchbar import (line 8)
2. The search state and filteredCoins filter logic (lines 19-25)
3. The Searchbar JSX component (lines 40-44)
4. Change Table props back to `coins={filteredCoins}` (line 49)

---

---

## Feature 4: Price Alerts

### Files to Modify
**4 files:**
- `Client/src/App.jsx` - State management & alert checker logic
- `Client/src/pages/PriceAlerts.jsx` - Entire alerts page
- `Client/src/components/Header.jsx` - Alerts nav link (desktop)
- `Client/src/components/Menu.jsx` - Alerts nav link (mobile)

### What Gets Removed
- Entire Price Alerts page and UI
- Alerts navbar links (desktop & mobile)
- Background alert checking interval (runs every 60 seconds)
- Alerts state management from App.js
- Toast notifications for triggered alerts

### Deletion Instructions

#### Step 1: Remove Alerts Import & Route from App.jsx
**File**: `Client/src/App.jsx`
**Line to delete: 16**
```javascript
// DELETE THIS LINE:
import PriceAlerts from "./pages/PriceAlerts";
```

**Before:**
```javascript
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Watchlist from "./pages/Watchlist";
import PriceAlerts from "./pages/PriceAlerts";           // DELETE
import { AnimatePresence } from "motion/react";
```

**After:**
```javascript
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Watchlist from "./pages/Watchlist";
import { AnimatePresence } from "motion/react";
```

---

#### Step 2: Remove Alerts API Import from App.jsx
**File**: `Client/src/App.jsx`
**Line to modify: 19**
Change from: `import { portfolioAPI, watchlistAPI, alertsAPI } from "./services/api";`
To: `import { portfolioAPI, watchlistAPI } from "./services/api";`

**Before:**
```javascript
import { useAuth } from "./context/AuthContext";
import { portfolioAPI, watchlistAPI, alertsAPI } from "./services/api";  // DELETE "alertsAPI"
import { ToastContainer, toast } from "react-toastify";
```

**After:**
```javascript
import { useAuth } from "./context/AuthContext";
import { portfolioAPI, watchlistAPI } from "./services/api";
import { ToastContainer, toast } from "react-toastify";
```

---

#### Step 3: Remove Alerts State from App.jsx
**File**: `Client/src/App.jsx`
**Lines to delete: 28, 37**

**Before:**
```javascript
const [portfolio, setPortfolio] = useState({});
const [alerts, setAlerts] = useState([]);           // DELETE
const alertsRef = useRef(alerts);                   // DELETE
const navigate = useNavigate();
```

**After:**
```javascript
const [portfolio, setPortfolio] = useState({});
const navigate = useNavigate();
```

---

#### Step 4: Remove Alerts from Logout Handler
**File**: `Client/src/App.jsx`
**Line to delete: 40**
Remove `setAlerts([]);` from the handleLogout function

**Before:**
```javascript
	const handleLogout = () => {
		setWatchlist([]);
		setPortfolio({});
		setAlerts([]);              // DELETE
		logout();
```

**After:**
```javascript
	const handleLogout = () => {
		setWatchlist([]);
		setPortfolio({});
		logout();
```

---

#### Step 5: Remove Alerts from useEffect Login Check
**File**: `Client/src/App.jsx`
**Line to delete: 56**
Remove `setAlerts([]);` from the isAuthenticated useEffect

**Before:**
```javascript
	} else {
		setWatchlist([]);
		setPortfolio({});
		setAlerts([]);              // DELETE
	}
```

**After:**
```javascript
	} else {
		setWatchlist([]);
		setPortfolio({});
	}
```

---

#### Step 6: Remove Alerts Data Loading from App.jsx
**File**: `Client/src/App.jsx`
**Lines to delete: 69-70, 76** (Approximately)
Remove alerts API call and setAlerts from loadUserData function

**Before:**
```javascript
	const loadUserData = async () => {
		try {
			const [portfolioData, watchlistData, alertsData] = await Promise.all([
			portfolioAPI.get(),
			watchlistAPI.get(),
			 alertsAPI.get(),           // DELETE
			]);
			setPortfolio(portfolioData);
		setWatchlist(watchlistData.watchlist);
		setAlerts(alertsData.alerts || []);  // DELETE
```

**After:**
```javascript
	const loadUserData = async () => {
		try {
			const [portfolioData, watchlistData] = await Promise.all([
			portfolioAPI.get(),
			watchlistAPI.get(),
			]);
			setPortfolio(portfolioData);
		setWatchlist(watchlistData.watchlist);
```

---

#### Step 7: Remove useEffect Sync for Alerts
**File**: `Client/src/App.jsx`
**Lines to delete: 82-85** (Approximately)
Remove the alertsRef sync useEffect

**Before:**
```javascript
	};

	// Keep alertsRef in sync with the latest alerts state
	useEffect(() => {
		alertsRef.current = alerts;
	}, [alerts]);

	// Price alert checker — runs every 60 seconds when user is logged in
```

**After:**
```javascript
	};

	// Price alert checker — runs every 60 seconds when user is logged in
```

---

#### Step 8: Remove Alert Checking Interval
**File**: `Client/src/App.jsx`
**Lines to delete: 87-118** (Approximately)
Remove entire alert checking useEffect and checkAlerts function

**Before:**
```javascript
	// Price alert checker — runs every 60 seconds when user is logged in
	useEffect(() => {
		if (!isAuthenticated) return;

		const checkAlerts = async () => {
			const currentAlerts = alertsRef.current;
			if (currentAlerts.length === 0) return;
			try {
				const coinIds = [...new Set(currentAlerts.map((a) => a.coin_id))].join(",");
				const res = await fetch(
					`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`
				);
				if (!res.ok) return;
				const coins = await res.json();

				const triggeredIds = [];
				currentAlerts.forEach((alert) => {
					const coin = coins.find((c) => c.id === alert.coin_id);
					if (!coin) return;
					const currentPrice = coin.current_price;
					const triggered =
						// ... rest of the checking logic
				});
			} catch (error) {
				console.error("Failed to check alerts:", error);
			}
		};

		const interval = setInterval(checkAlerts, 60000); // Check every 60 seconds
		return () => clearInterval(interval);
	}, [isAuthenticated, alerts]);
```

**After:**
(Nothing - entire useEffect removed)

---

#### Step 9: Remove Alerts NavLink from Header.jsx
**File**: `Client/src/components/Header.jsx`
**Lines to delete: ~84-94**
Remove entire Alerts NavLink section

**Before:**
```javascript
					Watchlist
					</NavLink>
				<NavLink
				 to="alerts"
				className={({ isActive }) =>
					`rounded-sm px-3 py-2 text-sm font-medium ${
						isActive
							? "bg-blue-200 text-blue-700 dark:bg-blue-700/20 dark:text-gray-100"
							: "dark:text-gray-300 dark:hover:text-white dark:hover:bg-blue-500/10 text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
					}`
				}
			>
				Alerts
			</NavLink>

				<CurrencySelector />
```

**After:**
```javascript
					Watchlist
					</NavLink>

				<CurrencySelector />
```

---

#### Step 10: Remove Alerts NavLink from Menu.jsx
**File**: `Client/src/components/Menu.jsx`
**Lines to delete: ~58-68**
Remove entire Alerts NavLink section from mobile menu

**Before:**
```javascript
			Watchlist
		</NavLink>
	<NavLink
	to="alerts"
	className={({ isActive }) =>
		`p-2 w-full font-medium ${
			isActive
			? "bg-blue-200 text-blue-700 dark:bg-blue-800/50 dark:text-white"
			: "hover:bg-blue-50 text-gray-700 dark:hover:bg-blue-600/10 dark:text-white"
		}`
	}
>
	Alerts
</NavLink>
		<button
```

**After:**
```javascript
			Watchlist
		</NavLink>
		<button
```

---

#### Step 11: Remove Alerts Route from App.jsx (Last Step)
**File**: `Client/src/App.jsx`
**Find the Routes section and delete the entire PriceAlerts route component**

**Before:**
```javascript
			<Route path="/watchlist" element={<ProtectedRoute><Watchlist watchlist={watchlist} toggleWatchlist={toggleWatchlist} /></ProtectedRoute>} />
			<Route path="/alerts" element={<ProtectedRoute><PriceAlerts alerts={alerts} setAlerts={setAlerts} /></ProtectedRoute>} />
			<Route path="/login" element={<Login />} />
```

**After:**
```javascript
			<Route path="/watchlist" element={<ProtectedRoute><Watchlist watchlist={watchlist} toggleWatchlist={toggleWatchlist} /></ProtectedRoute>} />
			<Route path="/login" element={<Login />} />
```

---

#### Step 12: Delete Entire PriceAlerts.jsx File
**File**: `Client/src/pages/PriceAlerts.jsx`
**Delete entire file** - It's no longer needed

---

### Restoration Instructions
To restore Alerts feature:
1. Re-add the import for PriceAlerts in App.jsx
2. Re-add alertsAPI import
3. Re-add all state and refs for alerts
4. Re-add the alert checking useEffect logic
5. Re-add Alerts NavLinks to Header.jsx and Menu.jsx
6. Re-add the Route for PriceAlerts
7. Restore the PriceAlerts.jsx file

---

---

## Feature 5: Currency Converter

### Files to Modify
**17 files total:**

**Core Currency Files (delete entirely):**
- `Client/src/context/CurrencyContext.jsx`
- `Client/src/components/CurrencySelector.jsx`
- `Client/src/hooks/useCurrencyData.js`

**Provider/Wrapper:**
- `Client/src/main.jsx`

**Components using Currency Context (17 files - remove imports & replace with hardcoded USD):**
- `Client/src/components/Header.jsx`
- `Client/src/components/BarChartComponent.jsx`
- `Client/src/components/CoinRow.jsx`
- `Client/src/components/PortfolioTable.jsx`
- `Client/src/components/PortfolioCoinRow.jsx`
- `Client/src/components/Form.jsx`
- `Client/src/components/PieChartComponent.jsx`
- `Client/src/pages/Dashboard.jsx`
- `Client/src/pages/PriceAlerts.jsx`
- `Client/src/utils/downloadCSV.js`
- `Client/src/utils/downloadPDF.js`

### What Gets Removed
- Currency selector dropdown from header
- Multi-currency support (only USD will be used)
- CurrencyContext provider wrapper
- useCurrencyData hook and coin exchange rate fetching
- All dynamic currency conversion calculations (`currency[1]` multiplications)
- Currency formatting with locale switching

### Deletion Instructions

#### Step 1: Remove CurrencyProvider from main.jsx
**File**: `Client/src/main.jsx`
**Line to delete: 7**
```javascript
// DELETE THIS LINE:
import { CurrencyProvider } from "./context/CurrencyContext";
```

**Before:**
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";  // DELETE
import { BrowserRouter } from "react-router-dom";
```

**After:**
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
```

---

#### Step 2: Remove CurrencyProvider Wrapper from main.jsx
**File**: `Client/src/main.jsx`
**Lines to delete: ~17-19** (The wrapper around App)

**Before:**
```javascript
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<CurrencyProvider>           // DELETE START
					<App />
				</CurrencyProvider>          // DELETE END
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
```

**After:**
```javascript
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
```

---

#### Step 3: Remove CurrencySelector from Header.jsx
**File**: `Client/src/components/Header.jsx`
**Line to delete: 4**
```javascript
// DELETE THIS LINE:
import CurrencySelector from "./CurrencySelector";
```

**Before:**
```javascript
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Menu from "./Menu";
import CurrencySelector from "./CurrencySelector";    // DELETE
import { useState } from "react";
```

**After:**
```javascript
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Menu from "./Menu";
import { useState } from "react";
```

---

#### Step 4: Remove useCurrency import from Header.jsx
**File**: `Client/src/components/Header.jsx`
**Remove the line: `import { useCurrency } from "../context/CurrencyContext";`** (if present)

**Before:**
```javascript
import { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";  // DELETE IF PRESENT
```

**After:**
```javascript
import { useState } from "react";
```

---

#### Step 5: Remove CurrencySelector JSX from Header.jsx
**File**: `Client/src/components/Header.jsx`
**Find and delete the CurrencySelector component in the header JSX** (~around line 80-85, depends on file)

**Before** (desktop header section):
```javascript
                    </NavLink>
                    <CurrencySelector />     // DELETE THIS LINE
                </div>
```

**After:**
```javascript
                    </NavLink>
                </div>
```

---

#### Step 6: Remove CurrencySelector from Mobile Menu (if present)
**File**: `Client/src/components/Menu.jsx`
**Check if CurrencySelector is used in menu and delete**

---

#### Step 7: Update Header.jsx - Remove useCurrency Hook Calls
**File**: `Client/src/components/Header.jsx`
**If Header.jsx has destructuring of useCurrency, remove it:**

**Before:**
```javascript
const { currency } = useCurrency();  // DELETE if present
```

**After:**
(Remove the line entirely)

---

#### Step 8: Update BarChartComponent.jsx
**File**: `Client/src/components/BarChartComponent.jsx`
**Line 11: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 14: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { currency, formatCurrency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Line 47: Replace currency multiplication with hardcoded USD format**

**Before:**
```javascript
formatCurrency(value * currency[1])
```

**After:**
```javascript
`$${(value).toFixed(2)}`
```

---

#### Step 9: Update CoinRow.jsx
**File**: `Client/src/components/CoinRow.jsx`
**Line 3: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 9: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { currency, formatCurrency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Lines 35, 41: Replace currency multiplications with hardcoded USD**

**Before (Line 35):**
```javascript
formatCurrency(coin.current_price * currency[1], 6)
```

**After:**
```javascript
`$${(coin.current_price).toFixed(6)}`
```

---

**Before (Line 41):**
```javascript
formatCurrency(((coin.market_cap ?? 0) * currency[1]).toFixed(2), 6)
```

**After:**
```javascript
`$${((coin.market_cap ?? 0) || 0).toFixed(2)}`
```

---

#### Step 10: Update PortfolioTable.jsx
**File**: `Client/src/components/PortfolioTable.jsx`
**Line 4: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 20: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { currency, formatCurrency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Update all references to `formatCurrency()` in the component JSX to use hardcoded USD format:**

**Before:**
```javascript
formatCurrency(value * currency[1])
```

**After:**
```javascript
`$${(value).toFixed(2)}`
```

---

#### Step 11: Update PortfolioCoinRow.jsx
**File**: `Client/src/components/PortfolioCoinRow.jsx`
**Line 3: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 12: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { currency, formatCurrency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Line 36: Replace currency multiplication**

**Before:**
```javascript
formatCurrency(coin.current_price * currency[1], 6)
```

**After:**
```javascript
`$${(coin.current_price).toFixed(6)}`
```

---

#### Step 12: Update Form.jsx
**File**: `Client/src/components/Form.jsx`
**Line 3: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 11: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { formatCurrency, currency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Lines 14, 37: Replace currency multiplications**

**Before (Line 14):**
```javascript
((coinData.current_price ?? 0) * currency[1]).toFixed(2)
```

**After:**
```javascript
(coinData.current_price ?? 0).toFixed(2)
```

---

**Before (Line 37):**
```javascript
formatCurrency(coinData.current_price * currency[1])
```

**After:**
```javascript
`$${(coinData.current_price).toFixed(2)}`
```

---

#### Step 13: Update PieChartComponent.jsx
**File**: `Client/src/components/PieChartComponent.jsx`
**Line 10: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 24: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { currency, formatCurrency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Line 50: Replace currency multiplication in formatter**

**Before:**
```javascript
formatter={(value) => formatCurrency(value * currency[1])}
```

**After:**
```javascript
formatter={(value) => `$${(value).toFixed(2)}`}
```

---

#### Step 14: Update Dashboard.jsx
**File**: `Client/src/pages/Dashboard.jsx`
**Line 8: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 26: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { currency, formatCurrency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Lines 58, 74: Replace currency multiplications**

**Before (Line 58):**
```javascript
formatCurrency(currentValue * currency[1])
```

**After:**
```javascript
`$${(currentValue).toFixed(2)}`
```

---

**Before (Line 74):**
```javascript
formatCurrency(totalInvestment * currency[1])
```

**After:**
```javascript
`$${(totalInvestment).toFixed(2)}`
```

---

#### Step 15: Update PriceAlerts.jsx
**File**: `Client/src/pages/PriceAlerts.jsx`
**Line 7: Delete useCurrency import**

**Before:**
```javascript
import { useCurrency } from "../context/CurrencyContext";  // DELETE
```

**After:**
(Line removed)

---

**Line 19: Delete useCurrency hook destructuring**

**Before:**
```javascript
const { formatCurrency } = useCurrency();  // DELETE
```

**After:**
(Line removed)

---

**Find all `formatCurrency()` calls and replace with hardcoded USD format:**

**Before:**
```javascript
formatCurrency(value * currency[1])
```

**After:**
```javascript
`$${(value).toFixed(2)}`
```

---

#### Step 16: Update downloadCSV.js
**File**: `Client/src/utils/downloadCSV.js`
**Remove all references to `currency[0]` in CSV headers (line 13-17 approximately)**

**Before:**
```javascript
// Header row with currency code
const headers = [
    "Coin Name",
    `Price (${currency[0]})`,
    `Market Cap (${currency[0]})`,
    ...
];
```

**After:**
```javascript
// Header row - USD only
const headers = [
    "Coin Name",
    "Price (USD)",
    "Market Cap (USD)",
    ...
];
```

---

**Replace all `currency[1]` multiplications (lines 35-39 approximately):**

**Before:**
```javascript
coin.current_price * currency[1]
```

**After:**
```javascript
coin.current_price
```

---

#### Step 17: Update downloadPDF.js
**File**: `Client/src/utils/downloadPDF.js`
**Remove all references to `currency[0]` in PDF headers (lines 31-35 approximately)**

**Before:**
```javascript
// Header with currency code
const header = `Portfolio Report - ${currency[0]}`;
```

**After:**
```javascript
// Header USD only
const header = `Portfolio Report - USD`;
```

---

**Replace all `currency[1]` multiplications (lines 53-177 approximately):**

**Before:**
```javascript
value * currency[1]
formatCurrency(amount * currency[1])
```

**After:**
```javascript
value
formatCurrency(amount)
```

---

#### Step 18: Delete Core Currency Files
**Delete these 3 files completely:**
1. `Client/src/context/CurrencyContext.jsx`
2. `Client/src/components/CurrencySelector.jsx`
3. `Client/src/hooks/useCurrencyData.js`

---

### Restoration Instructions
To restore Currency Converter feature:
1. Re-add the CurrencyProvider import and wrapper in main.jsx
2. Re-add all `import { useCurrency }` statements in the 11 component files
3. Re-add all useCurrency hook destructuring calls
4. Replace all hardcoded USD strings back to `formatCurrency(value * currency[1])` calls
5. Re-add CurrencySelector import in Header.jsx and render it
6. Restore the 3 deleted files from backup:
   - CurrencyContext.jsx
   - CurrencySelector.jsx
   - useCurrencyData.js

---

### Verification Steps
After removal:
- [ ] CurrencySelector dropdown is gone from header
- [ ] All prices display in USD format (e.g., `$1,234.56`)
- [ ] No console errors about missing context
- [ ] Portfolio prices calculate correctly in USD only
- [ ] Charts display with hardcoded USD labels
- [ ] CSV export shows "USD" in headers, not dynamic currency codes
- [ ] PDF export shows "USD" in headers, not dynamic currency codes
- [ ] All components render without errors
- [ ] Prices update correctly when data refreshes

---

## Quick Reference: Deletion Checklist

### Feature 1: Charts Removal
- [ ] Delete chart imports (3 lines from Dashboard.jsx)
- [ ] Delete `const chart = useChart()` (1 line)
- [ ] Delete Pie Chart section (entire div)
- [ ] Delete Bar Chart section (entire div)
- [ ] Keep TopCoins component

### Feature 2: Watchlist Removal
- [ ] Delete star icon imports from CoinRow.jsx
- [ ] Delete star button from CoinRow.jsx JSX
- [ ] Delete Watchlist NavLink from Header.jsx
- [ ] Delete Watchlist NavLink from Menu.jsx

### Feature 3: Searchbar Removal
- [ ] Delete Searchbar import from Home.jsx
- [ ] Delete search state (useState)
- [ ] Delete filteredCoins filter logic
- [ ] Delete Searchbar JSX component
- [ ] Change Table props from `filteredCoins` to `coins`

### Feature 4: Price Alerts Removal
- [ ] Delete PriceAlerts import from App.jsx
- [ ] Delete alertsAPI from imports
- [ ] Delete alerts state and alertsRef
- [ ] Remove setAlerts from logout handler
- [ ] Remove setAlerts from auth check useEffect
- [ ] Remove alerts from loadUserData API call
- [ ] Delete alerts sync useEffect
- [ ] Delete entire alert checking useEffect (60-second interval)
- [ ] Delete Alerts NavLink from Header.jsx
- [ ] Delete Alerts NavLink from Menu.jsx
- [ ] Delete Alerts route from Routes
- [ ] Delete entire PriceAlerts.jsx file

### Feature 5: Currency Converter Removal
- [ ] Delete CurrencyProvider import from main.jsx
- [ ] Remove CurrencyProvider wrapper from JSX in main.jsx
- [ ] Delete CurrencySelector import from Header.jsx
- [ ] Remove CurrencySelector component from Header.jsx JSX
- [ ] Delete useCurrency imports from 11 component files (BarChartComponent, CoinRow, PortfolioTable, PortfolioCoinRow, Form, PieChartComponent, Dashboard, PriceAlerts)
- [ ] Remove useCurrency hook calls from all 11 components
- [ ] Replace all `formatCurrency(value * currency[1])` with hardcoded USD format
- [ ] Replace all `currency[0]` references with "USD" in export files (downloadCSV.js, downloadPDF.js)
- [ ] Replace all `currency[1]` multiplications with direct values in export files
- [ ] Delete CurrencyContext.jsx file
- [ ] Delete CurrencySelector.jsx file
- [ ] Delete useCurrencyData.js file

---

## Quick Reference: Complete Deletion Checklist

### Feature 1: Charts Removal
- [ ] Delete chart imports (3 lines from Dashboard.jsx)
- [ ] Delete `const chart = useChart()` (1 line)
- [ ] Delete Pie Chart section (entire div)
- [ ] Delete Bar Chart section (entire div)
- [ ] Keep TopCoins component

### Feature 2: Watchlist Removal
- [ ] Delete star icon imports from CoinRow.jsx
- [ ] Delete star button from CoinRow.jsx JSX
- [ ] Delete Watchlist NavLink from Header.jsx
- [ ] Delete Watchlist NavLink from Menu.jsx

### Feature 3: Searchbar Removal
- [ ] Delete Searchbar import from Home.jsx
- [ ] Delete search state (useState)
- [ ] Delete filteredCoins filter logic
- [ ] Delete Searchbar JSX component
- [ ] Change Table props from `filteredCoins` to `coins`

### Feature 4: Price Alerts Removal
- [ ] Delete PriceAlerts import from App.jsx
- [ ] Delete alertsAPI from imports
- [ ] Delete alerts state and alertsRef
- [ ] Remove setAlerts from logout handler
- [ ] Remove setAlerts from auth check useEffect
- [ ] Remove alerts from loadUserData API call
- [ ] Delete alerts sync useEffect
- [ ] Delete entire alert checking useEffect (60-second interval)
- [ ] Delete Alerts NavLink from Header.jsx
- [ ] Delete Alerts NavLink from Menu.jsx
- [ ] Delete Alerts route from Routes
- [ ] Delete entire PriceAlerts.jsx file

### Feature 5: Currency Converter Removal
- [ ] Delete CurrencyProvider import from main.jsx
- [ ] Remove CurrencyProvider wrapper from JSX in main.jsx
- [ ] Delete CurrencySelector import from Header.jsx
- [ ] Remove CurrencySelector component from Header.jsx JSX
- [ ] Delete useCurrency imports from 11 component files
- [ ] Remove useCurrency hook calls from all components
- [ ] Replace all `formatCurrency(value * currency[1])` with hardcoded USD format
- [ ] Replace all `currency[0]` references with "USD" in export files
- [ ] Replace all `currency[1]` multiplications with direct values
- [ ] Delete CurrencyContext.jsx file
- [ ] Delete CurrencySelector.jsx file
- [ ] Delete useCurrencyData.js file

---

## Testing Flow

1. **Remove Feature 1 (Charts)** → Take screenshot → Restore
2. **Remove Feature 2 (Watchlist)** → Take screenshot → Restore
3. **Remove Feature 3 (Searchbar)** → Take screenshot → Restore
4. **Remove Feature 4 (Alerts)** → Take screenshot → Restore
5. **Remove Feature 5 (Currency Converter)** → Take screenshot → Restore

All changes are isolated and don't affect other features except where noted above.

---

## Restoration Status

✅ **Feature 1 (Charts)**: Currently RESTORED
✅ **Feature 2 (Watchlist)**: Currently RESTORED
✅ **Feature 3 (Searchbar)**: Currently RESTORED
✅ **Feature 4 (Alerts)**: Currently RESTORED
✅ **Feature 5 (Currency Converter)**: Currently RESTORED

All features verified and available in the application.

---

## Notes

- **No cascading dependencies**: Each feature can be removed independently (except Currency Converter affects 17 files)
- **API calls continue**: Backend queries still work during feature removal
- **State management**: Context providers (Auth) remain active; Currency context can be fully removed
- **Data persists**: User data, portfolio, watchlist, and alerts data still loads (just hidden from UI)
- **Alerts Background Job**: 60-second interval checker can be disabled by removing alert checking useEffect
- **Currency Converter Complexity**: This is the most complex feature to remove as it affects 17+ files across components, utilities, and export functions. Consider removing last or in a separate session.
- **USD Hardcoding**: After currency removal, all monetary values will display as USD with 2-6 decimal places depending on the context

---

*Last Updated: April 2, 2026*
*Created for: Feature Testing & Experimentation*
*Features Documented: 5 (Charts, Watchlist, Searchbar, Price Alerts, Currency Converter)*
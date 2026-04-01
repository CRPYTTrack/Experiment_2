# Feature Removal & Restoration Guide

This document provides **exact line numbers and code changes** needed to remove/restore 3 visual features from the CryptoTrack application for testing purposes.

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

---

## Testing Flow

1. **Remove Feature 1 (Charts)** → Take screenshot → Restore
2. **Remove Feature 2 (Watchlist)** → Take screenshot → Restore
3. **Remove Feature 3 (Searchbar)** → Take screenshot → Restore
4. **Remove Feature 4 (Alerts)** → Take screenshot → Restore

All changes are isolated and don't affect other features except where noted above.

---

## Restoration Status

✅ **Feature 1 (Charts)**: Currently RESTORED
✅ **Feature 2 (Watchlist)**: Currently RESTORED
✅ **Feature 3 (Searchbar)**: Currently RESTORED
✅ **Feature 4 (Alerts)**: Currently RESTORED

All features verified and available in the application.

---

## Notes

- **No cascading dependencies**: Each feature can be removed independently
- **API calls continue**: Backend queries still work during feature removal
- **State management**: Context providers (Auth, Currency) remain active
- **Data persists**: User data, portfolio, watchlist, and alerts data still loads (just hidden from UI)
- **Alerts Background Job**: 60-second interval checker can be disabled by removing alert checking useEffect

---

*Last Updated: April 1, 2026*
*Created for: Feature Testing & Experimentation*
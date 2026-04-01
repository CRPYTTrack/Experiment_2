# Feature Removal & Restoration Guide

This document provides **exact line numbers and code changes** needed to remove/restore 3 visual features from the CryptoTrack application for testing purposes.

---

## Feature 1: Charts (Pie & Bar) - Dashboard

### Location
**File**: `Client/src/pages/Dashboard.jsx`

### What Gets Removed
- Portfolio Allocation (Pie Chart visualization)
- Investment vs Current Value (Bar Chart visualization)
- Chart-related imports and data processing

### Deletion Instructions

#### Step 1: Remove Chart Imports
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

### Locations
Multiple files contain watchlist functionality:

| File | What to Remove |
|------|----------------|
| `Client/src/components/CoinRow.jsx` | Star icon imports + watchlist button |
| `Client/src/components/Header.jsx` | Watchlist nav link (desktop) |
| `Client/src/components/Menu.jsx` | Watchlist nav link (mobile) |

### File 1: CoinRow.jsx

#### Step 1: Remove Star Icon Imports
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

### Location
**File**: `Client/src/pages/Home.jsx`

### What Gets Removed
- Search input field for filtering coins
- Search state management
- Coin filtering logic
- Searchbar component import

### Deletion Instructions

#### Step 1: Remove Searchbar Import
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

---

## Testing Flow

1. **Remove Feature 1 (Charts)** → Take screenshot → Restore
2. **Remove Feature 2 (Watchlist)** → Take screenshot → Restore
3. **Remove Feature 3 (Searchbar)** → Take screenshot → Restore

All changes are isolated and don't affect other features except where noted above.

---

## Notes

- **No cascading dependencies**: Each feature can be removed independently
- **API calls continue**: Backend queries still work during feature removal
- **State management**: Context providers (Auth, Currency) remain active
- **Data persists**: User data, portfolio, and watchlist data still loads (just hidden from UI)

---

*Last Updated: April 1, 2026*
*Created for: Feature Testing & Experimentation*
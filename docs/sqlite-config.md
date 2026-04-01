# SQLite Database Configuration

## Overview

CryptoTrack now uses **SQLite** (via `better-sqlite3`) as the embedded database, eliminating the need for external database services. The database file is automatically created and initialized on the first server startup.

## Database File Location

- **Default:** `Server/data.sqlite`
- **Custom:** Set via `DB_PATH` environment variable in `.env`

## Database Schema

The application automatically creates and manages the following tables:

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Watchlist Table
```sql
CREATE TABLE watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  coin TEXT NOT NULL,
  added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, coin),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Portfolio Table
```sql
CREATE TABLE portfolio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  coin TEXT NOT NULL,
  total_investment REAL NOT NULL,
  coins REAL NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, coin),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Alerts Table
```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  coin_id TEXT NOT NULL,
  coin_name TEXT NOT NULL,
  coin_image TEXT,
  target_price REAL NOT NULL,
  condition TEXT NOT NULL CHECK(condition IN ('above', 'below')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Environment Variables

Create a `.env` file in the `Server` directory:

```env
# SQLite database file path (relative to Server directory)
DB_PATH="./data.sqlite"

# JWT secret for token signing
JWT_SECRET="your-secret-key-here"

# Server port
PORT=3000

# Client origin (for CORS)
CLIENT="http://localhost:5173"
```

## Key Features

- **Automatic Initialization:** Tables and schema are created automatically on server startup
- **Foreign Keys:** Enabled by default with cascading deletes
- **Auto-increment IDs:** Integer primary keys with auto-increment
- **Persistence:** Data is persisted in the SQLite file between server restarts
- **Atomic Operations:** SQL transactions are handled by better-sqlite3

## Backup & Portability

Since the database is a single file:

1. **Backup:** Simply copy the `data.sqlite` file to another location
2. **Transfer:** The database file can be moved to another machine running the same Node.js application
3. **Git Ignore:** The `data.sqlite` file is excluded from version control (see `.gitignore`)

## Development Tips

- Use SQLite CLI to inspect the database:
  ```bash
  sqlite3 Server/data.sqlite ".schema"
  ```
- Or use VS Code extensions like "SQLite" for easy database browsing
- Database queries use parameterized statements to prevent SQL injection

## Migration from Supabase

If you previously used Supabase:
- No external database credentials needed
- No database URL configuration required
- All data is stored locally in the SQLite file
- See the `-Experiment_2/docs/setup-guide.md` for fresh setup instructions

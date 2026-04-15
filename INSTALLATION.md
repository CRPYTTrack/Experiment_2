# CryptoTrack Installation Guide

This comprehensive guide will help you set up and run the CryptoTrack application on your local machine for development.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start (5 Minutes)](#quick-start-5-minutes)
- [Detailed Setup](#detailed-setup)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Backend Setup](#step-2-backend-setup)
  - [Step 3: Frontend Setup](#step-3-frontend-setup)
  - [Step 4: Run the Application](#step-4-run-the-application)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Development Commands](#development-commands)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or later recommended) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Verify Installation

Open your terminal and run:

```bash
node --version      # Should be v18 or higher
npm --version       # Should be v9 or higher
git --version       # Any recent version
```

---

## Quick Start (5 Minutes)

If you're familiar with Node.js projects, here's the quick version:

```bash
# Clone repository
git clone <REPO_CLONE_URL>
cd <REPO_DIRECTORY>

# Backend setup
cd Server
npm install
echo 'DB_PATH="./data.sqlite"
PORT=3000
CLIENT="http://localhost:5173"
JWT_SECRET="your-secret-key-here"' > .env
npm run dev

# Frontend setup (in new terminal)
cd Client
npm install
echo 'VITE_API_URL="http://localhost:3000"' > .env
npm run dev

# Open http://localhost:5173 in your browser
```

---

## Detailed Setup

### Step 1: Clone the Repository

Open your terminal and navigate to where you want to store the project:

```bash
git clone <REPO_CLONE_URL>
cd <REPO_DIRECTORY>
```

You should now see the following structure:
- `Client/` - React frontend application
- `Server/` - Express backend API
- `docs/` - Documentation
- `README.md` - Project overview

### Step 2: Backend Setup

#### 2.1 Navigate to Server Directory

```bash
cd Server
```

#### 2.2 Install Dependencies

```bash
npm install
```

This will install all backend dependencies including:
- **express**: Web server framework
- **better-sqlite3**: SQLite database driver (includes SQLite, no separate installation needed)
- **passport.js**: Authentication middleware
- **jsonwebtoken**: JWT token generation
- And other supporting libraries

#### 2.3 Create Environment Variables

Create a `.env` file in the `Server` directory:

```bash
# On Windows
type nul > .env
```

Add the following content to `.env`:

```env
# Database path (relative to Server directory)
DB_PATH="./data.sqlite"

# Server port
PORT=3000

# Frontend origin (for CORS)
CLIENT="http://localhost:5173"

# JWT secret for token signing (use a random string)
JWT_SECRET="your-super-secret-key-change-this-in-production"
```

**Important:** 
- Change `JWT_SECRET` to a strong random string in production
- Keep these values safe and never commit `.env` to version control

#### 2.4 Start the Backend Server

```bash
npm run dev
```

You should see output like:
```
Server running on port 3000
```

The backend is now running and will automatically:
- Create the SQLite database file (`data.sqlite`)
- Initialize all required tables (users, portfolio, watchlist, alerts)
- Set up database schema with proper constraints

**Keep this terminal open** and proceed to frontend setup in a new terminal.

---

### Step 3: Frontend Setup

Open a **new terminal window/tab** and navigate back to the project root:

```bash
cd <REPO_DIRECTORY>
cd Client
```

#### 3.1 Install Dependencies

```bash
npm install
```

This will install all frontend dependencies including:
- **react**: UI library
- **react-router**: Client-side routing
- **axios**: HTTP client
- **recharts**: Chart components
- **tailwind css**: Styling framework
- **jspdf**: PDF export
- And other UI/utility libraries

#### 3.2 Create Environment Variables

Create a `.env` file in the `Client` directory:

```bash
# On Windows
type nul > .env
```

Add the following content:

```env
# Backend API URL
VITE_API_URL="http://localhost:3000"
```

#### 3.3 Start the Frontend Server

```bash
npm run dev
```

You should see output indicating the app is running:
```
VITE v{version} ready in {time}ms

➜  Local:   http://localhost:5173/
```

---

### Step 4: Run the Application

1. Open your web browser and navigate to **http://localhost:5173**
2. You should see the CryptoTrack home page
3. Create a new account or log in with existing credentials
4. Start exploring cryptocurrencies!

---

## Database Setup

### Automatic Initialization

The SQLite database is **automatically created and initialized** on the first backend server startup:

1. The `data.sqlite` file is created in the `Server` directory
2. All required tables are created with proper schema:
   - `users` - User accounts and authentication
   - `watchlist` - User's favorite cryptocurrencies
   - `portfolio` - User's cryptocurrency holdings
   - `alerts` - Price alerts

**No manual database setup is required!**

### Database Details

For detailed information about the database schema, see [SQLite Configuration](./docs/sqlite-config.md).

---

## Environment Variables

### Backend (.env in Server directory)

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DB_PATH` | Path to SQLite database file | `./data.sqlite` | `./data.sqlite` |
| `PORT` | Server port | `3000` | `3000` |
| `CLIENT` | Frontend origin (CORS) | `http://localhost:5173` | `http://localhost:5173` |
| `JWT_SECRET` | Secret for JWT tokens | Required | `your-secret-key` |

### Frontend (.env in Client directory)

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_URL` | Backend API URL | Required | `http://localhost:3000` |

---

## Development Commands

### Backend Commands

From the `Server` directory:

```bash
# Start development server (with auto-restart on file changes)
npm run dev

# Start production server
npm start

# Run linter
npm run lint

# Run tests (if configured)
npm test
```

### Frontend Commands

From the `Client` directory:

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Preview production build
npm run preview
```

---

## Troubleshooting

### Issue: "Cannot find module 'better-sqlite3'"

**Solution:** Reinstall dependencies in the Server directory:
```bash
cd Server
npm install --verbose
```

If still failing, try:
```bash
npm install --force
npm run dev
```

### Issue: Port 3000 already in use

**Solution:** Either kill the process using port 3000 or change the port in `.env`:
```env
PORT=3001
```

Then update the Frontend `.env`:
```env
VITE_API_URL="http://localhost:3001"
```

### Issue: Port 5173 already in use

**Solution:** The frontend will automatically use the next available port. Check the terminal output for the actual URL.

### Issue: "data.sqlite not created"

**Solution:** Make sure you've created the `.env` file in the Server directory and started the server with `npm run dev`. The database creates on first startup.

### Issue: CORS errors in browser console

**Solution:** Verify the frontend and backend URLs:
1. Backend `.env` has `CLIENT="http://localhost:5173"` (or your frontend URL)
2. Frontend `.env` has `VITE_API_URL="http://localhost:3000"` (or your backend URL)

### Issue: Login fails or session expires immediately

**Solution:** Check that:
1. The backend server is running (`npm run dev` in Server directory)
2. Both servers can communicate (no CORS errors in browser console)
3. `JWT_SECRET` in backend `.env` is not empty

---

## Additional Resources

- [API Reference](./docs/api-reference.md) - Complete API endpoint documentation
- [System Architecture](./docs/architecture.md) - Project architecture overview
- [SQLite Configuration](./docs/sqlite-config.md) - Database schema and configuration
- [README](./README.md) - Project overview and features

---

## Next Steps

After successful installation:

1. **Explore the Application:** Create an account, add coins to your portfolio, and check out the dashboard
2. **Read Documentation:** Review the [API Reference](./docs/api-reference.md) to understand available endpoints
3. **Review Code:** Start with `Client/src/main.jsx` and `Server/server.js` to understand the architecture
4. **Start Developing:** Make changes and use hot reload to see updates instantly

---

## Getting Help

If you encounter any issues not covered in the troubleshooting section:
1. Check the browser console for error messages
2. Check the terminal output for backend errors
3. Ensure all prerequisites are installed
4. Try clearing node_modules and reinstalling: `rm -r node_modules && npm install`

Happy coding! 🚀

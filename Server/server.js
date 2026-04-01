const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(
	cors({
		origin: process.env.CLIENT || "https://cryptotrack-ultimez.vercel.app",
		credentials: true,
	})
);

app.use(express.json());
const passport = require("./auth");
app.use(passport.initialize());

app.get("/", (req, res) => {
	return res.send("API is running");
});

app.post("/register", async (req, res) => {
	const { username, password } = req.body;
	try {
		// Check if user already exists
		const existing = db
			.prepare("SELECT id FROM users WHERE username = ?")
			.get(username);

		if (existing) {
			return res.status(400).json({ Error: "User Already Exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(
			username,
			hashedPassword
		);

		return res.status(200).json({ message: "User Registered Successfully" });
	} catch (err) {
		console.error("Register error:", err);
		return res.status(500).json({ error: err.message });
	}
});

app.post("/login", (req, res, next) => {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err) {
			return res.status(500).json({ error: "Authentication error" });
		}
		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const payload = { id: user.id, username: user.username };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		res.status(200).json({
			message: "Login successful",
			token: token,
			user: {
				id: user.id,
				username: user.username,
			},
		});
	})(req, res, next);
});

app.get(
	"/watchlist",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const userId = req.user.id;
			const data = db
				.prepare("SELECT coin FROM watchlist WHERE user_id = ?")
				.all(userId);

			return res.json({ watchlist: data.map((row) => row.coin) });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

app.get(
	"/portfolio",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const userId = req.user.id;
			const data = db
				.prepare(
					"SELECT coin, total_investment, coins FROM portfolio WHERE user_id = ?"
				)
				.all(userId);

			// Convert to object map keyed by coin name
			const portfolio = {};
			for (const row of data) {
				portfolio[row.coin] = {
					totalInvestment: row.total_investment,
					coins: row.coins,
				};
			}

			return res.json(portfolio);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

app.put(
	"/watchlist/add",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const userId = req.user.id;
		const coin = req.body.coin;
		try {
			db.prepare("INSERT OR IGNORE INTO watchlist (user_id, coin) VALUES (?, ?)").run(
				userId,
				coin
			);

			const data = db
				.prepare("SELECT coin FROM watchlist WHERE user_id = ?")
				.all(userId);

			return res.status(200).json({ watchlist: data.map((row) => row.coin) });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

app.put(
	"/watchlist/remove",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const userId = req.user.id;
		const coin = req.body.coin;
		try {
			db.prepare("DELETE FROM watchlist WHERE user_id = ? AND coin = ?").run(
				userId,
				coin
			);

			const data = db
				.prepare("SELECT coin FROM watchlist WHERE user_id = ?")
				.all(userId);

			return res.status(200).json({ watchlist: data.map((row) => row.coin) });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

app.put(
	"/portfolio/update",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const userId = req.user.id;
		const { coin, coinData } = req.body;

		try {
			if (
				!coin ||
				!coinData ||
				typeof coinData.totalInvestment !== "number" ||
				typeof coinData.coins !== "number"
			) {
				return res.status(400).json({ error: "Invalid input data" });
			}

			// Get existing coin entry
			const existing = db
				.prepare(
					"SELECT id, user_id, coin, total_investment, coins FROM portfolio WHERE user_id = ? AND coin = ?"
				)
				.get(userId, coin);

			if (existing) {
				const newCoins = existing.coins + coinData.coins;

				if (coinData.coins < 0) {
					const sellAmount = Math.abs(coinData.coins);
					if (sellAmount > existing.coins) {
						return res.status(400).json({
							error: `Cannot sell ${sellAmount} coins. You only own ${existing.coins} coins.`,
						});
					}
				}

				if (newCoins <= 0) {
					// Remove coin from portfolio
					db.prepare("DELETE FROM portfolio WHERE user_id = ? AND coin = ?").run(
						userId,
						coin
					);
				} else {
					let newTotalInvestment;
					if (coinData.coins < 0) {
						const remainingRatio = newCoins / existing.coins;
						newTotalInvestment = existing.total_investment * remainingRatio;
					} else {
						newTotalInvestment = existing.total_investment + coinData.totalInvestment;
					}

					db.prepare(
						"UPDATE portfolio SET coins = ?, total_investment = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND coin = ?"
					).run(newCoins, newTotalInvestment, userId, coin);
				}
			} else {
				if (coinData.coins < 0) {
					return res.status(400).json({
						error: "Cannot sell coins that are not in your portfolio",
					});
				}
				if (coinData.totalInvestment > 0 && coinData.coins > 0) {
					db.prepare(
						"INSERT INTO portfolio (user_id, coin, total_investment, coins) VALUES (?, ?, ?, ?)"
					).run(userId, coin, coinData.totalInvestment, coinData.coins);
				}
			}

			// Return updated portfolio
			const data = db
				.prepare(
					"SELECT coin, total_investment, coins FROM portfolio WHERE user_id = ?"
				)
				.all(userId);

			const portfolio = {};
			for (const row of data) {
				portfolio[row.coin] = {
					totalInvestment: row.total_investment,
					coins: row.coins,
				};
			}

			return res.status(200).json(portfolio);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

// ─── Price Alerts Routes ───────────────────────────────────────────────────────

// GET /alerts - fetch all alerts for the authenticated user
app.get(
	"/alerts",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const userId = req.user.id;
			const data = db
				.prepare(
					"SELECT id, coin_id, coin_name, coin_image, target_price, condition, created_at FROM alerts WHERE user_id = ? ORDER BY created_at DESC"
				)
				.all(userId);

			return res.json({ alerts: data });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

// POST /alerts - create a new price alert
app.post(
	"/alerts",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const userId = req.user.id;
			const { coin_id, coin_name, coin_image, target_price, condition } = req.body;

			if (!coin_id || !coin_name || !target_price || !condition) {
				return res.status(400).json({ error: "Missing required fields" });
			}
			if (!["above", "below"].includes(condition)) {
				return res.status(400).json({ error: "Condition must be 'above' or 'below'" });
			}
			if (isNaN(parseFloat(target_price)) || parseFloat(target_price) <= 0) {
				return res.status(400).json({ error: "Target price must be a positive number" });
			}

			const insertResult = db
				.prepare(
					"INSERT INTO alerts (user_id, coin_id, coin_name, coin_image, target_price, condition) VALUES (?, ?, ?, ?, ?, ?)"
				)
				.run(
					userId,
					coin_id,
					coin_name,
					coin_image || null,
					parseFloat(target_price),
					condition
				);

			const data = db
				.prepare(
					"SELECT id, coin_id, coin_name, coin_image, target_price, condition, created_at FROM alerts WHERE id = ? AND user_id = ?"
				)
				.get(insertResult.lastInsertRowid, userId);

			return res.status(201).json({ alert: data });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

// DELETE /alerts/:id - delete a specific alert
app.delete(
	"/alerts/:id",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const userId = req.user.id;
			const alertId = Number(req.params.id);

			db.prepare("DELETE FROM alerts WHERE id = ? AND user_id = ?").run(alertId, userId);

			return res.json({ message: "Alert deleted successfully" });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	}
);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

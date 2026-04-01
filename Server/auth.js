const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const db = require("./db");

passport.use(
	new localStrategy(async (username, password, done) => {
		try {
			const user = db
				.prepare("SELECT id, username, password FROM users WHERE username = ?")
				.get(username);

			if (!user) {
				return done(null, false, { message: "Username not found." });
			}

			const isPassword = await bcrypt.compare(password, user.password);
			if (isPassword) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Incorrect password." });
			}
		} catch (err) {
			return done(err, false);
		}
	})
);

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		async (payload, done) => {
			try {
				const user = db
					.prepare("SELECT id, username, password FROM users WHERE id = ?")
					.get(payload.id);

				if (!user) {
					return done(null, false);
				}
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

module.exports = passport;

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../db');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done) {
		db.any('SELECT * FROM "users" WHERE "email"=$1', [email])
		.then( user => {
			if (!user) {
			  return done(null, false, { message: 'This email address is not registered' });
			}
			bcrypt.compare(password, user[0].password, (err, isMatch) => {
			  if (isMatch) {
				return done(null, user[0]);
			  } else {
				return done(null, false, { message: 'Password incorrect' });
			  }
			});
		} )
		.catch( error => {
			return done(null, false, { message: 'Error: Could not connect' });
		})
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	db.any('SELECT * FROM "users" WHERE "id"=$1', [id])
	.then( user => done(null, user[0]))
	.catch( error => done(error))
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};


/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
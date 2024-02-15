/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require('../models/user');
const JWT_OPTIONS = {expiresIn: 60 * 60}


let authToken;

router.post('/login', async (req, res, next) => {
  try {
    let { username, password } = req.body;

      if (await User.authenticate(username, password)) {

        const token = jwt.sign({username}, SECRET_KEY);

        User.updateLoginTimestamp(username);

        return res.json({message: `Logged in!`,token});

      } else {
    throw new ExpressError("Invalid username/password", 400);
      }
  } catch (e) {

    return next(e);
  }
})

router.post('/register', async (req, res, next) => {
  try {

    let { username } = await User.register(req.body);
    let token = jwt.sign({username}, SECRET_KEY, JWT_OPTIONS);

    User.updateLoginTimestamp(username)
    authToken = token;

    return res.json({authToken})

  }catch(e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another!", 400));
    }
    return next(e)
  }
});




module.exports = router;
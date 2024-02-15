const express = require("express");
const router = new express.Router();

const { ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', async (req, res, next) => {
  console.log('req.body', req.body)
  let users = await User.all();

  return res.json({users})

})



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', ensureCorrectUser, async (req, res, next) => {

  let user = await User.get(username);

  return res.json({user})
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {

  let message = await User.messagesTo(req.params.username)
  console.log('message in the get', message)

  return res.json({message});
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from", ensureCorrectUser, async function (req, res, next) {
  try {

    let messages = await User.messagesFrom(req.params.username);
    
    return res.json({messages});
  
  }catch(err) {
    return next(err);
  }
});


module.exports = router;
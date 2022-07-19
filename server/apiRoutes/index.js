const router = require('express').Router();
const { Room, Message, User } = require('../db');

//POST /api/messages

router.post('/messages', async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    console.log('This is the message posted:', message);
  } catch (err) {
    next(err);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    console.log('This is the user: ', user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
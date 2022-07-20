const router = require('express').Router();
const { Message, User } = require('../db');

//POST /api/messages

router.post('/messages', async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    res.send(message);
    console.log('API, This is the message posted:', message);
  } catch (err) {
    next(err);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.send(user);
    console.log('API, This is the user: ', user);
  } catch (error) {
    next(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    next(err);
  }
});

module.exports = router;

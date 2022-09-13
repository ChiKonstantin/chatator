//CHATATOR
const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
const path = require('path'); // Node's path module
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const router = require('./apiRoutes');
// const { getLangName } = require('../support/utils');
// const getLangName = require('../client/support/utils');
const {
  userArr,
  addUser,
  checkRoomCode,
  removeAndFetchDepartedUser,
  fetchUsersInRoom,
} = require('./db/usersStorage');
//listening to server PORT
const server = app.listen(PORT, () =>
      console.log(`Listening to port ${PORT}`)
    );

//socket connection to server
const socket = require('socket.io');
// const { emit } = require('process');
const serverSocket = socket(server);

//tracking socket.id by userId

serverSocket.on('connection', (socket) => {
  console.log(`Connection from client ${socket.id}`);
  console.log('THIS IS CONENTS OF USER ARRAY, FYI: ', userArr);
  socket.on('join-room', (user) => {
    socket.join(user.userRoom);
    //adding socket info to user object
    const userWithSocket = {
      ...user,
      socketId: socket.id,
    };
    //adding user object to list
    addUser(userWithSocket);
    //sending list of all users in room to all users in room
    serverSocket
      .in(user.userRoom)
      .emit('check-who-is-in-room', fetchUsersInRoom(user));
    //sending admin-message to all users in room (except self) that new user joined
    const newUserMessage = {
      message: `joined the room, they speak ${user.userLangName}!`,
      messageLang: 'en',
      messageRoom: user.userRoom,
      messageUser: '',
      messageType: 'admin',
      adminMessageSubject: user.userName,
    };
    console.log('NEW USER MESSAGE', newUserMessage);
    socket.broadcast.to(user.userRoom).emit('new-message', newUserMessage);
  });

  socket.on('check-room', (userRoomCode) => {
    //formula should check the room code.
    const response = checkRoomCode(userRoomCode);
    serverSocket.to(socket.id).emit('check-room-response', response);
  });

  socket.on('new-message', (message) => {
    socket.broadcast.to(message.messageRoom).emit('new-message', message);
  });
  //add user leaving room feature in the future...
  //link socket.id (which is given) with user when joining, and then
  //determine which user left via the socket.id and emit customized message.
  // socket.on('disconnect', () => {
  //   socket.to(userRoom).emit('message', customMessageWithUserName);
  // });

  socket.on('typing-message', (user) => {
    socket.broadcast.to(user.userRoom).emit('typing-message', user.userName);
  });

  socket.on('disconnect', () => {
    console.log('SOMEONE LEFT', socket.id);
    const departedUser = removeAndFetchDepartedUser(socket.id);
    if (departedUser !== undefined) {
      socket.broadcast.to(departedUser.userRoom).emit('new-message', {
        message: `left the room.`,
        messageLang: 'en',
        messageRoom: departedUser.userRoom,
        messageUser: '',
        messageType: 'admin',
        adminMessageSubject: departedUser.userName,
      });
      serverSocket
        .in(departedUser.userRoom)
        .emit('check-who-is-in-room', fetchUsersInRoom(departedUser));
    }
  });
});

//MIDDLEWARE:
// logging middleware for server logs
app.use(morgan('dev'));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '../public')));

//body parsing middleware
//Requests frequently contain a body - if you want to use it in req.body, then you'll need some middleware to parse the body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//mounting all api routes on /api - other routes collected from index.js in apiRoutes
// app.use('/api', router);

//Index HTML dispatch:
// sends index.html for any requests that don't match one of our API routes.
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

//ERROR HANDLER:
//handling 500 errors
app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res
    .status(err.status || 500)
    .send(
      err.message || 'Yeaaah, looks like I failed you... This is an error... '
    );
});

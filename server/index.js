//CHATATOR
const express = require('express');
const app = express();
const path = require('path'); // Node's path module
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./apiRoutes');
// const { getLangName } = require('../support/utils');
// const getLangName = require('../client/support/utils');
const {
  userArr,
  addUser,
  removeAndFetchDepartedUser,
  fetchUsersInRoom,
} = require('./db/usersStorage');
//listening to server PORT
const server = app.listen(8080, function () {
  console.log(`Listening to port`);
});

//socket connection to server
const socket = require('socket.io');
const serverSocket = socket(server);

//tracking socket.id by userId

serverSocket.on('connection', (socket) => {
  console.log(`Connection from client ${socket.id}`);
  socket.on('join-room', (user) => {
    socket.join(user.userRoom);
    //!!!! create a formula to strip userArr off of socket.ids
    serverSocket
      .in(user.userRoom)
      .emit('check-who-is-in-room', fetchUsersInRoom(user));
    const userWithSocket = {
      ...user,
      socketId: socket.id,
    };
    // console.log('USER W SOCKET', userWithSocket);
    addUser(userWithSocket);
    serverSocket.in(user.userRoom).emit('add-user-to-room', userWithSocket);
    socket.broadcast.to(user.userRoom).emit('new-message', {
      message: `📢 ${user.userName} joined the room, they speak ${user.userLangName}!`,
      messageLang: 'en',
      messageRoom: user.userRoom,
      messageUser: '',
      messageType: 'admin',
    });
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

  socket.on('disconnect', () => {
    console.log('SOMEONE LEFT', socket.id);
    const departedUser = removeAndFetchDepartedUser(socket.id);
    if (departedUser !== undefined) {
      socket.broadcast.to(departedUser.userRoom).emit('new-message', {
        message: `📢 ${departedUser.userName} left the room.`,
        messageLang: 'en',
        messageRoom: departedUser.userRoom,
        messageUser: '',
        messageType: 'admin',
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
app.use('/api', router);

//Index HTML dispatch:
// sends index.html for any requests that don't match one of our API routes.
app.get('*', function (req, res) {
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

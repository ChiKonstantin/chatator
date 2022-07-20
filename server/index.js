//CHATATOR
const express = require('express');
const app = express();
const path = require('path'); // Node's path module
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./apiRoutes');

//listening to server PORT
const server = app.listen(8080, function () {
  console.log(`Listening to port`);
});

//socket connection to server
const socket = require('socket.io');
const serverSocket = socket(server);

serverSocket.on('connection', (socket) => {
  console.log(`Connection from client ${socket.id}`);
  socket.on('new-message', (inputMessage) => {
    socket.broadcast.emit('new-message', inputMessage);
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

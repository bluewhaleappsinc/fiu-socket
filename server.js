'use strict';

const express = require('express');
const http = require('http');
const multer = require('multer');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const cors = require('cors');

const CONFIG = {
  PORT: 4334
}

const app = express();
app.use(cors({credentials: true, origin: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Create socketIO and wrap app server inside
const server = http.Server(app);
const io = socketIO(server);

// Add middleware to handle post request for express
const form = multer();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('static'));

// Serve index.html for path '/', this is home path
app.get('/', (req, res, next) => {
  res.sendFile('index.html', { root: __dirname });
});

// Serve index.html for path '/', this is home path
app.post('/', (req, res, next) => {
  res.sendFile('index.html', { root: __dirname });
});

server.listen(CONFIG.PORT, () => {
  console.log('Server is running at port: ' + CONFIG.PORT);
});

io.on('connection', (socket) => {
  console.log('Client connected');

  let participant_id = socket.handshake.query.participant_id;
  socket.join(participant_id);

  socket.on("trigger", function (data) {
    console.log("In Coming Data :: ");
    console.log(data);
    console.log("Participant ID :: ", data.participant_id);

    io.to(data.participant_id).emit('triggered', data);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

'use strict';

const express = require('express');
const http = require('http');
const multer = require('multer');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const cheerio = require('cheerio');
const fs = require('fs');
const cors = require('cors');

const CONFIG = {
  PORT: process.env.PORT || 8080
}

var obj = {
   table: []
};

var json = JSON.stringify(obj);

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

// io.set('origins', "*:*");

io.on('connection', socket => {
  console.log("Connection  :: ", socket.id);

  let participant_id = socket.handshake.query.participant_id;
  socket.join(participant_id);
  
  console.log("In coming participant_id", participant_id);
  console.log("Connection  :: ", socket.id);

  socket.emit('connectSuccess', { content: 'You have connected.' });

  socket.on('trigger', function (data) {
    console.log("In Coming Data :: ");
    console.log(data);
    console.log("my data participant id :: ", data.participant_id);

    io.to(data.participant_id).emit('triggered',data);
  });
});
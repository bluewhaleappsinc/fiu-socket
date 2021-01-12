'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 4334;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

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

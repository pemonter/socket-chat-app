const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.write(`<h1>Socket I Start on Port : ${port}</h1>`);
});

io.on('connection', socket => {
    console.log('[IO] Connection => Server has a new connection')
    socket.on('chat.message', data => {
        console.log(data)
        socket.broadcast.emit('chat.message', data)
    })
    socket.on('disconnect', () => {
        console.log('[SOCKET] Disconnect => A connection was disconnected')
    })
})

server.listen(port, () => {
  console.log('listening on *:8080');
});
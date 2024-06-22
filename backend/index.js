const { Server } = require("socket.io");
const { createServer } = require("http");
const uuid4 = require('uuid4');
const { uniqueNamesGenerator, starWars } = require('unique-names-generator');
const fs = require('fs');

const users = require('./users.json');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let connections = JSON.parse(fs.readFileSync('./users.json', { encoding: 'utf-8' }));
const messages = JSON.parse(fs.readFileSync('./messages.json', { encoding: 'utf-8' }));

console.log('>>> connections', connections);

const MAIN_NS = "/";
const mainSocket = io.of(MAIN_NS);

mainSocket.on("connect", (socket) => {
  // const name = uniqueNamesGenerator({
  //   dictionaries: [starWars]
  // });

  // const currentUser = { id: socket.id, uuid: `PLAYER-${uuid4()}`, name };
  // connections.push(currentUser);
  // socket.emit('GET_MY_PROFILE', currentUser);
  //
  // console.log('>>> connections on connect', connections);
  //
  // socket.broadcast.emit('NEW_MEMBER', connections);
  // socket.emit('NEW_MEMBER', connections);

  fs.writeFileSync('./users.json', JSON.stringify(connections));
  
  socket.on('LOG_IN', (message) => {
    const currentUser = connections[parseInt(message, 10)];
    console.log('>>> currentUser', currentUser);
    
    socket.emit('GET_MY_PROFILE', currentUser);
    socket.emit('NEW_MEMBER', connections);
  });

  socket.on('CHAT_MESSAGE', (message) => {
    const user = connections.find(x => x.id === socket.id);

    messages.push({
      id: `MESSAGE-${uuid4()}`,
      userId: user?.uuid,
      date: new Date(),
      message,
    });
    
    fs.writeFileSync('./messages.json', JSON.stringify(messages));

    socket.emit('NEW_MESSAGE', messages);
    socket.broadcast.emit('NEW_MESSAGE', messages);
  });

  socket.on('disconnect', (msg) => {
    // console.log('>>> on disc', socket.id);
    connections = connections.filter(x => x.id !== socket.id);
    socket.broadcast.emit('NEW_MEMBER', connections);
    console.log('>>> connections after disconnect', connections);
    console.log('>>> messages after disconnect', messages);
  });
});

io.listen(8082);

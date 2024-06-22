// const req = async () => {
//   let url = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
//   let response = await fetch(url);
//
//   let commits = await response.json(); // read response body and parse as JSON
//
//   console.log('>>> commits', commits[0]?.author);
// }
//
// req();
const {io} = require("socket.io-client");
const { renderChat, renderMessages } = require('./chat');

const SOCKET_CONFIG = {
  forceNew: true,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: 15,
  reconnectionDelay: 2000,
  timeout: 200000
};

const BASE_URL = 'ws://localhost:8082';
const MAIN_NS = '/';
let currentUser = null;

const socket = io(`${BASE_URL}${MAIN_NS}`, {
  ...SOCKET_CONFIG,
});

socket.on("connect", () => {
  console.log('>>> on connect', socket.id);
});

socket.on("disconnect", () => {
  // console.log('>>> on disconnect', socket.id);
  localStorage.removeItem(`MY_PROFILE-${socket.id}`);
  socket.close();
});

socket.on('GET_MY_PROFILE', payload => {
  console.log('>>> get my profile');
  localStorage.setItem(`MY_PROFILE-${payload.id}`, JSON.stringify(payload));
  currentUser = payload;
});

socket.on('NEW_MEMBER', (payload) => {
  // console.log('>>> new member', payload);
  renderChat(payload, socket.id);
});

socket.on('NEW_MESSAGE', payload => {
  console.log('>>> new message', payload);
  renderMessages(payload, socket.id);
})

const button = document.getElementById('send-button');
const input = document.getElementById('input');
const submitNumber = document.getElementById('submit-number');

button.addEventListener('click', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('CHAT_MESSAGE', input.value);
    input.value = '';
  }
});

submitNumber.addEventListener('click', function (e) {
  const input = document.getElementById('number');

  e.preventDefault();
  if (input.value) {
    socket.emit('LOG_IN', input.value);
    // input.value = '';
  }
});



export const renderChat = (connections = [], socketId) => {
  const userData = localStorage.getItem(`MY_PROFILE-${socketId}`);
  const user = userData != null ? JSON.parse(userData) : null;
  console.log('>>> user', user);
  console.log('>>> connections', connections);

  const me = document.getElementById('me');
  me.innerHTML = `From "${user?.name}"`;

  const messagesElement = document.getElementById('messages');
  messagesElement.innerHTML = '<li>Participants:</li>';

  connections.forEach(item => {
    if (socketId !== item.id) {
      messagesElement.innerHTML += `<li>Chat with - "${item?.name}"</li>`
    }
  });
};


export const renderMessages = (messages = [], socketId) => {
  console.log('>>> messages', messages);
  console.log('>>> socketId', socketId);
  const chatElement = document.getElementById('chat');
  chatElement.innerHTML = null;
  
  const userData = localStorage.getItem(`MY_PROFILE-${socketId}`);
  const user = userData != null ? JSON.parse(userData) : null;
  
  messages.forEach((item) => {
    chatElement.innerHTML += `<li class="${item.userId === user.uuid ? 'right' : 'left'}">
        <span>${item.message}</span>
      </li>`
  })
}


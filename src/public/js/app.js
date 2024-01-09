const socket = io();

const welcome = document.querySelector("#welcome")
const form = welcome.querySelector("form")
const room = document.querySelector("#room");

room.hidden = true;

let roomName;
let userName;

function addMessage(message) {
  const ul = room.querySelector("ul")
  const li  = document.createElement("li")
  li.innerText = message;
  ul.appendChild(li);
}

function handlesMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = "";
  });
}

function showRoom(newCount) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount}) | User Name: ${userName}`
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handlesMessageSubmit)
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const enter = welcome.querySelector("#enter");
  const roomInput = enter.querySelector("#roomInput");
  const nameInput = enter.querySelector("#nameInput");
  roomName = roomInput.value;
  userName = nameInput.value;
  socket.emit("enter_room", roomName, userName, showRoom);
})

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount}) | User Name: ${user}`
  addMessage(`${user} joined!`)
});

socket.on("bye", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount}) | User Name: ${user}`
  addMessage(`${user} left...`);
});

socket.on("new_message", addMessage)

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if(rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  })
});
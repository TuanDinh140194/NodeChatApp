const socket = io();

//Elements
const $messageForm = document.querySelector("#form-message");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $message = document.querySelector("#chat");

//Template
const messageTemplate = document.querySelector("#message-template").innerHTML;
//Location template
const locationTemplate = document.querySelector("#location-template").innerHTML;
//Sidebar template
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;
//Join
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  //New message element
  const $newMessage = $message.lastElementChild;

  //Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //Visible height
  const visibleHeight = $message.offsetHeight;

  //Height of messages container
  const containerHeight = $message.scrollHeight;

  //How far have i scrolled?
  const scrollOffSet = $message.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffSet) {
    $message.scrollTop = $message.scrollHeight;
  }
};
socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createAt: moment(message.createAt).format("h:mm a"),
  });

  $message.insertAdjacentHTML("beforeend", html);

  autoscroll();
});

socket.on("locationMessage", (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createAt: moment(message.createAt).format("h:mm a"),
  });

  $message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });

  document.querySelector("#sidebar").innerHTML = html;

   // Set the document title to show the room number
   document.title = `Chat Room - ${room}`;

});

document.querySelector("#form-message").addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message deliveried!");
  });
});

$locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  $locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $locationButton.removeAttribute("disabled");
        console.log("Location shared!");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

const socket = io();
const activeRooms = [];

const $activeRoomTemplate = document.querySelector(
  "#activeRoom-template"
).innerHTML;

socket.on("activeRoom", (rooms) => {
  const html = Mustache.render($activeRoomTemplate, {
    rooms,
  });

  if (!rooms || rooms.rooms.length === 0) {
    document.querySelector("#activeRoom").innerHTML =
      "<h2>Active Room</h2> <div>No room active</div>";
  } else {
    document.querySelector("#activeRoom").innerHTML = html;
  }

  // Clear the activeRooms array and copy the new rooms
  activeRooms.length = 0;
  activeRooms.push(...rooms.rooms);
});

//Get create room submit
document
  .getElementById("createRoom")
  .addEventListener("submit", function (event) {
    const room = document.querySelector('input[name="room"]').value;

    // Check if the room already exists
    if (activeRooms.includes(room)) {
      event.preventDefault(); // Prevent form submission
      alert("Room already exists!");
    }
  });

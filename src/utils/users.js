const users = [];

// Add User
const addUser = ({ id, username, room }) => {
  //Clean Data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate Data
  if (!username || !room) {
    return {
      error: "User or Room does not exist",
    };
  }

  //Check for existing users
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //Validate UserName
  if (existingUser) {
    return {
      error: "User Name has existed",
    };
  }

  //Store User
  const user = { id, username, room };
  users.push(user);

  return { user };
};

//Rmemove User
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

//Get USer
const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return {
      error: "User doesn't exist !",
    };
  }
  return user;
};

//Get Users In Room
const getUserInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

//Get All Active Room
const getAllActiveRooms = () => {
  const rooms = users.map((user) => user.room);
  return [...new Set(rooms)];
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
  getAllActiveRooms,
};

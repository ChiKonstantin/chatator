let userArr = [];

const addUser = function (user) {
  userArr.push(user);
  console.log('THIS IS USER ARRAY ON SERVER:', userArr);
};
const checkRoomCode = function (roomCode) {
  const usersInRoom = userArr.filter((user) => user.userRoom === roomCode);
  if (usersInRoom.length > 0) {
    return 1;
  } else {
    return 0;
  }
};

const removeAndFetchDepartedUser = function (id) {
  const [userToRemove] = userArr.filter((user) => user.socketId === id);
  //find index of element
  //use splice to return element while removing it from the original array
  const indexOfUser = userArr.indexOf(userToRemove);
  if (indexOfUser > -1) {
    const [removedUser] = userArr.splice(indexOfUser, 1);
    console.log('DEPARTED USER IN userStorage: ', removedUser);
    return removedUser;
  } else {
    console.log('No user with this id was found');
  }
};

const fetchUsersInRoom = function (inputUser) {
  //strip users off the socket id!
  const usersInRoom = userArr.filter(
    (user) => user.userRoom === inputUser.userRoom
  );
  return usersInRoom;
};

module.exports = {
  userArr,
  addUser,
  checkRoomCode,
  removeAndFetchDepartedUser,
  fetchUsersInRoom,
};

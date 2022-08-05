let userArr = [];

const addUser = function (user) {
  userArr.push(user);
  console.log('THIS IS USER ARRAY ON SERVER:', userArr);
};

const removeUser = function (userId) {
  const userToRemove = userArr.filter((user) => {
    user.id === userId;
  });
  userArr = userArr.filter((user) => {
    user.id !== userId;
  });
  console.log('AFTER USER REMOVED:', userArr);
  return userToRemove.socketId;
};

module.exports = {
  userArr,
  addUser,
  removeUser,
};

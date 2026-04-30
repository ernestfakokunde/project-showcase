let ioInstance = null;

export const getUserRoom = (userId) => `user:${userId}`;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const emitToUser = (userId, eventName, payload = {}) => {
  if (!ioInstance || !userId) {
    return;
  }

  ioInstance.to(getUserRoom(userId.toString())).emit(eventName, payload);
};

export const emitNotificationUpdate = (userId, payload = {}) => {
  emitToUser(userId, "notifications:updated", payload);
};

export const emitRequestUpdate = (userId, payload = {}) => {
  emitToUser(userId, "requests:updated", payload);
};

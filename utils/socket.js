import { io } from "socket.io-client";

export const socket = io("http://localhost:8080"); // backend URL

// Listen for incoming notifications
export const listenForTasks = (callback) => {
  socket.on("newTask", callback);
};

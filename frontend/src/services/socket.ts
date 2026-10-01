import { io } from "socket.io-client";

const socket = io("http://localhost:7090", {
  transports: ["polling"],
  autoConnect: false,
});

export default socket;
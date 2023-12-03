import { io } from "socket.io-client";
import { server } from "./urls";

const url = server;

export const socket = io(url, {
    autoConnect: false,
    withCredentials: true,
});
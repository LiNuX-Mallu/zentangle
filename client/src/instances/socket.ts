import { io } from "socket.io-client";
import { server } from "./urls";

const url = server;

export const socket = io(url, {
    autoConnect: true,
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": server,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Credentials": "true",
    },
});
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nocache from 'nocache';
import dotenv from 'dotenv';
import {connect as mongoConnect} from 'mongoose';
import router from './router';
import { Server, Socket } from "socket.io";
import http from 'http';
import { MessageInterface } from './src/interfaces/messageInterface';
import saveMessage from './src/services/user/saveMessage';


dotenv.config();
let {MONGO_URI, PORT, HOST, CLIENT_HOST, CLIENT_PORT} = process.env;

const app = express();

app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({
    origin: [
        `http://${CLIENT_HOST}:${CLIENT_PORT}`,
    ],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
    credentials: true,
}));

app.use('/api', router);

declare namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      HOSTNAME: string;
      MONGO_URI: string;
    }
}

const server = http.createServer(app);

//socket io
const io = new Server(server, {
    cors: {
        origin: `http://${CLIENT_HOST}:${CLIENT_PORT}`,
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
});


//chat configuration
io.on('connection', async (socket: Socket) => {
    socket.on('joinChat', (username) => {
        socket.join(username);
    });
    socket.on('leaveChat', (username) => {
        socket.leave(username);
    })

    socket.on('sendMessage', (message: {message: MessageInterface, to: string, chatId: string | null}) => {
        io.to(message.to).emit('receiveMessage', message.message);
        try {
            saveMessage(message?.chatId, message?.message?.sender, message?.to, message.message)
            .then((res: string | null | undefined) => {
                if (res) {
                    io.to(message?.message?.sender).emit('receiveChatId', res);
                    io.to(message?.to).emit('receiveChatId', res);
                }
            });
        } catch(error) {
            console.error(error);
        }
    });
    socket.on('typing', (data: {username: string, flag: boolean}) => {
        io.to(data.username).emit('isTyping', data.flag);
    });
});
////////////////////////////////////////////////


mongoConnect(MONGO_URI!).then(() => {
    console.log("connected to database");
    server.listen((typeof PORT === 'number') ? PORT : 3000, HOST!, () => {
        console.log(`Server listening at http://${HOST}:${PORT}`);
    });
}).catch((error) => {
    console.log("failed connecting to database\n", error);
});


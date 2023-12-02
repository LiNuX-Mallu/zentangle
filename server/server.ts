import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nocache from 'nocache';
import dotenv from 'dotenv';
import {connect as mongoConnect} from 'mongoose';
import router from './router';
import io from 'socket.io';

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

mongoConnect(MONGO_URI!).then(() => {
    console.log("connected to database");
    app.listen((typeof PORT === 'number') ? PORT : 3000, HOST!, () => {
        console.log(`Server listening at http://${HOST}:${PORT}`);
    });
}).catch((error) => {
    console.log("failed connecting to database\n", error);
});


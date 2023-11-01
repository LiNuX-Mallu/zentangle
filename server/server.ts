import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nocache from 'nocache';
import dotenv from 'dotenv';
import {connect as mongoConnect} from 'mongoose';
import router from './router';

const app = express();

dotenv.config();
app.use(cors());
app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api', router);

declare namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      HOSTNAME: string;
      MONGO_URI: string;
    }
}

let {MONGO_URI, PORT, HOSTNAME} = process.env;

mongoConnect(MONGO_URI!).then(() => {
    console.log("connect to database");
    app.listen((typeof PORT === 'number') ? PORT : 3000, HOSTNAME!, () => {
        console.log(`Server listening at http://${HOSTNAME}:${PORT}`);
    });
}).catch((error) => {
    console.log("failed connecting to database\n", error);
});


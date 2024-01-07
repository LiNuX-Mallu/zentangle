import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import nocache from "nocache";
import dotenv from "dotenv";
import { connect as mongoConnect } from "mongoose";
import router from "./router";
import { Server, Socket } from "socket.io";
import http from "http";
import { MessageInterface } from "./src/interfaces/messageInterface";
import saveMessage from "./src/services/user/chat/saveMessage";
import path from "path";

dotenv.config();
let { MONGO_URI, PORT, HOST, CLIENT_PORT, CLIENT_HOST } = process.env;

const app = express();

app.use(function(req, res, next) {
    let oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', '1y');
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const corsOptions: CorsOptions = {
// 	origin: 'https://zentangle-tdo2clfghq-de.a.run.app',
// 	// `http://${HOST}:${PORT}`,
// 	// `http://${CLIENT_HOST}:${CLIENT_PORT}`,
// 	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
// 	optionsSuccessStatus: 200, 
// 	credentials: true,
// 	preflightContinue: true,
// 	allowedHeaders: ["Content-Type", "Authorization"],
// }

// app.options("*", cors(corsOptions));
// app.use(cors(corsOptions));

app.use("/api", router);

app.use(express.static(path.join(__dirname, '../client/dist'), {index: false}));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const server = http.createServer(app);

//socket io
const io = new Server(server, {
	cors: {origin: '*', methods: "*"},
	transports: ["websocket", "polling"],
	allowEIO3: true,
});

//chat and video configuration
io.on("connection", async (socket: Socket) => {
	socket.on("joinApp", (username: string) => {
		socket.join(username);
	});
	socket.on("leaveApp", (username: string) => {
		socket.leave(username);
	});

	socket.on("joinChat", (name: string) => {
		socket.join(name);
	});
	socket.on("leaveChat", (name: string) => {
		socket.leave(name);
	});

	//video call
	socket.on("requestVideoCall", (data: { from: string; to: string }) => {
		io.to(data.to).emit("receiveVideoCallRequest", data.from);
	});
	socket.on("rejectVideoCall", (data: { from: string; to: string }) => {
		io.to(data?.to + data?.from).emit("receiveVideoCallRejection", data?.from);
	});
	socket.on("acceptVideoCall", (data: { from: string; to: string }) => {
		io.to(data.to).emit("receiveVideoCallAcceptance", data?.from);
	});
	socket.on("sendStopCall", (data: { from: string; to: string }) => {
		io.to(data?.to).emit("receiveStopCall", data?.from);
	});
	socket.on("sendEndCall", (data: { from: string; to: string }) => {
		io.to(data?.to).emit("receiveEndCall", data?.from);
	});

	interface Data {
		offer?: RTCSessionDescription;
		answer?: RTCSessionDescription;
		candidate?: RTCIceCandidate;
		to: string;
	}

	socket.on("sendSignal", (data: Data) => {
		io.to(data.to).emit("receiveSignal", data);
	});

	//messaging
	socket.on(
		"sendMessage",
		(message: {
			message: MessageInterface;
			to: string;
			chatId: string | null;
		}) => {
			io.to(message.to + message?.message?.sender).emit(
				"receiveMessage",
				message.message
			);
			try {
				saveMessage(
					message?.chatId,
					message?.message?.sender,
					message?.to,
					message.message
				).then((res: string | null | undefined) => {
					if (res) {
						io.to(message?.message?.sender + message?.to).emit(
							"receiveChatId",
							res
						);
						io.to(message?.to + message?.message?.sender).emit(
							"receiveChatId",
							res
						);
					}
				});
			} catch (error) {
				console.error(error);
			}
		}
	);
	socket.on(
		"typing",
		(data: { username: string; me: string; flag: boolean }) => {
			io.to(data?.username + data?.me).emit("isTyping", data.flag);
		}
	);
});

mongoConnect(MONGO_URI!)
	.then(() => {
		console.log("connected to database");
		server.listen(typeof PORT === "number" ? PORT : 8080, HOST ?? '0.0.0.0', () => {
			console.log(`Server listening at http://${HOST}:${PORT}`);
		});
	})
	.catch((error) => {
		console.log("failed connecting to database\n", error);
	});

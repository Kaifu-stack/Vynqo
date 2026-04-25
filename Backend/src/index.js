/* require('dotenv').config({path: './.env'});
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})

import connnectDB from './db/database.js';
import { app } from './app.js';


connnectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
        app.on("error", (error) => {
            console.log("ERR", error);
            throw error
        });
    })
    .catch((err) => {
        console.log("Mongo db connection failed !!", err);
    })
*/

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import connnectDB from './db/database.js';
import { app } from './app.js';

import http from "http";
import { Server } from "socket.io";

//  CREATE SERVER
const server = http.createServer(app);

// SOCKET.IO SETUP
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// GLOBAL ACCESS
global.io = io;

//  SOCKET CONNECTION
io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

//  DB + SERVER START
connnectDB()
    .then(() => {

        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`);
        });

        app.on("error", (error) => {
            console.log("ERR", error);
            throw error;
        });

    })
    .catch((err) => {
        console.log("Mongo db connection failed !!", err);
    });




























































// const app = express();
// (async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             dbName: DB_Name,
//         });
//         app.on("error", (error) => {
//             console.log("ERRR", error);
//             throw error
//         });
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// })();
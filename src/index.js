// require('dotenv').config({path: './.env'});
import dotenv from 'dotenv';
import connnectDB from './db/database.js';


dotenv.config({
    path: './env'
})
connnectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
    app.on("error", (error) => {
        console.log("ERR", error);
        throw error });
})
.catch((err) => {
    console.log("Mongo db connection failed !!", err);
    })





























































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
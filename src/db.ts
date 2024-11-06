import mongoose from "mongoose"
import { env } from "process"

export default function handleMongoConnection() {
    mongoose.connect((env as {MONGO_CONN_STRING: string}).MONGO_CONN_STRING).then(() => {
        console.log("Connected to mongo server.")
    });
}

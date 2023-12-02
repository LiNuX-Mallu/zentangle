import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    messages:  [{
        sender: String,
        type: String,
        message: String,
        timestamp: Date,
        status: String,
    }],
});

export default model('chat', chatSchema);
import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    messages:  [
        {
            sender: {type: String},
            type: {type: String},
            message: {type: String},
            timestamp: {type: Date},
            status: {type: String},
        }
    ],
});

export default model('chat', chatSchema);
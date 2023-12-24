import { Schema, model } from "mongoose";

const reportSchema = new Schema({
    status: {type: String},
    complainer: {type: String},
    complainee: {type: String},
    complaint: {type: String},
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default model('Report', reportSchema);
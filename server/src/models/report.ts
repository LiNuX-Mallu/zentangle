import { Schema, model } from "mongoose";

const reportSchema = new Schema({
    status: {
        type: String,
        enum: ['open', 'closed'],
    },
    complainer: {type: String},
    complainee: {type: String},
    complaint: {type: String},
    images: [{
        type: String,
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

export default model('Report', reportSchema);
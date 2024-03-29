import { Schema, model } from "mongoose";

const alertSchema = new Schema({
    title: {type: String},
    content: {type: String},
    seenBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    timestamp: {type: Date, default: Date.now},
    isActive: {type: Boolean, default: true},
});

export default model('Alert', alertSchema);
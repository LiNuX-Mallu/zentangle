import { Schema, model } from "mongoose";

const verificationSchema = new Schema({
    requestedBy: {type : Schema.Types.ObjectId, ref: 'User'},
    doc: {type: String},
    requestedOn: {type: Date, default: Date.now},
});

export default model('verification', verificationSchema);
import { Schema, model } from "mongoose";

const premiumSchema = new Schema({
    price: {type: Number, default: 249},
    duration: {type: Number, default: 30},
    currency: {type: String, default: 'INR'},
});

export default model('premiums', premiumSchema);
import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    username: String,
    password: String,
});

export default model('Admin', adminSchema);
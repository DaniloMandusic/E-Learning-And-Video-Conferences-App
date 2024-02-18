// src/models/UserModel.ts
import mongoose, { Schema } from 'mongoose';

let ClassSchema = new Schema({
    name: String,
    status: String
});

const ClassModel = mongoose.model('Class', ClassSchema);

export default ClassModel;

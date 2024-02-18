// src/models/UserModel.ts
import mongoose, { Schema } from 'mongoose';

let UserSchema = new Schema({
    username: String,
    password: String,
    securityQuestion: String,
    securityAnswer: String,
    name: String,
    surname: String,
    gender: String,
    address: String,
    phoneNumber: String,
    email: String,
    schoolType: String,
    grade: Number,
    profilePicture: Buffer,
    profilePictureUrl: String,
    profileType: String,
    profileStatus: String,

    cv: Buffer,
    cvUrl: String,
    heardFrom: String,
    teachingGroup: String,
    classes: String

});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

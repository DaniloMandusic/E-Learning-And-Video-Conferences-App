// src/models/UserModel.ts
import mongoose, { Schema } from 'mongoose';

let TutionSchema = new Schema({
    student: String, 
    professor: String,
    selectedClass: String,
    date: String,
    time: String,
    additionalInfo: String,
    wantTwoClasses: String,
    isConfirmed: String,
    isDone: String,
    comment: String,
    declineComment: String,
    score: String,
    isScored: String
});

const TutionModel = mongoose.model('Tution', TutionSchema);

export default TutionModel;

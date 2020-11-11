import mongoose from "mongoose";

export interface LoginAttemptDbModel extends mongoose.Document {
    _id: string;
    email: string;
}

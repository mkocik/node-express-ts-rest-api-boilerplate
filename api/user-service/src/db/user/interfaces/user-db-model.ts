import mongoose from "mongoose";

export interface UserDbModel extends mongoose.Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

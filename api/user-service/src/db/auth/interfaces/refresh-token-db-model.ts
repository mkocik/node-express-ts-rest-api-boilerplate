import mongoose from "mongoose";

export interface RefreshTokenDbModel extends mongoose.Document {
    _id: string;
    userId: string;
    token: string;
    expires: number;
    createdByIp: string;
    revokedAt: number | undefined;
    revokedByIp: string | undefined;
    forAccessToken: string
}

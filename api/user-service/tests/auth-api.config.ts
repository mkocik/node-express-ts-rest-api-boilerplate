import MongoClient, {Db} from 'mongodb';
import {config} from "dotenv";

export const SERVICE_URL = 'http://localhost:8080/api/v1/';

config();

export async function dbConnector(): Promise<Db> {
    const connection = await MongoClient.connect(process.env.MONGODB_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: 'admin'
    });
    const db: Db = connection.db();
    db.on('error', console.error.bind(console, 'Mongo connection error:'));

    return db;
}

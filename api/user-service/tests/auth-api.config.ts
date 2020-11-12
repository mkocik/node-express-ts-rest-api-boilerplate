import MongoClient, {Db} from 'mongodb';
import {config} from "dotenv";
config();

export const SERVICE_URL = process.env.PROTOCOL + '://' + process.env.RDS_HOSTNAME + ':' +
    process.env.PORT + '/api/' + process.env.API_VERSION;

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

import {Service} from '@api-template/api-service'
import apiV1 from './api/index'
import {UserService} from "./application/user.service";
import mongoose from "mongoose";
import {UserMongoDb} from "./db/user/user.mongo-db";
import {WelcomeEmailSubscriber} from "./events/subscribers/welcome-email-subscriber";
import {AuthenticationService} from "./application/authentication.service";
import {RefreshTokenMongoDb} from "./db/auth/refresh-token.mongo-db";
import {LoginAttemptMongoDb} from "./db/login-attempts/login-attempt.mongo-db";

class UserServiceAPI extends Service {
    constructor() {
        super();
        this.setDBConnection();
    }

    public setRoutes(): void {
        this.express.use('/api/' + process.env.API_VERSION, apiV1)
    }

    public setDBConnection() {
        mongoose.connect(process.env.MONGODB_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin'
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Mongo connection error:'));
        db.once('open', () => {
            console.log("Mongo connection successful!")
        });
    }

    public getSwaggerOptions() {
        return {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'User Service',
                    version: '1.0.0',
                    description: 'Sample service providing user authentication-based features',
                    contact: {
                        name: 'Maciej Kocik',
                        email: 'maciex36@gmail.com',
                    },
                },
                servers: [
                    {
                        url:
                            process.env.PROTOCOL +
                            '://' +
                            process.env.RDS_HOSTNAME +
                            ':' +
                            process.env.PORT +
                            '/api/' +
                            process.env.API_VERSION,
                    },
                ],
            },
            apis: ['src/api/**/*.ts', 'src/models/**/*.ts', 'src/middlewares/**/*.ts'],
        }
    }

    protected registerEventsSubscribers() {
        this.publisher.subscribe(new WelcomeEmailSubscriber());
    }

    protected setApplicationServices() {
        this.appServices.set(UserService.getType(), new UserService(new UserMongoDb(), this.publisher))
       this.appServices.set(AuthenticationService.getType(), new AuthenticationService(new RefreshTokenMongoDb(), new LoginAttemptMongoDb(),  this.publisher))
    }
}

export default new UserServiceAPI()

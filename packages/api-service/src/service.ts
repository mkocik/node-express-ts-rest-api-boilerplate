import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {config} from "dotenv";
import {internalServerError, notFound} from "./middlewares/error.middleware";
import {DomainEventPublisher, ForwardDomainEventPublisher} from "@api-template/domain-event-publisher";
import {ApplicationService} from "./application/application.service";

export abstract class Service {
    private readonly _express: express.Application
    private readonly _publisher: DomainEventPublisher
    private readonly _appServices: Map<string, ApplicationService>;

    get publisher(): DomainEventPublisher {
        return this._publisher;
    }

    get appServices(): Map<string, ApplicationService> {
        return this._appServices;
    }

    protected constructor() {
        config();
        this._express = express()
        this._appServices = new Map<string, ApplicationService>();
        this._publisher = new ForwardDomainEventPublisher();
        this.setUp();
    }

    public abstract setRoutes(): void

    public abstract getSwaggerOptions(): any

    get express(): express.Application {
        return this._express;
    }

    public setUp(): void {
        this.setEventsPublisher()
        this.setApplicationServices()
        this.registerEventsSubscribers()
        this.setUpSwagger()
        this.setMiddlewares()
        this.setRoutes()
        this.catchErrors()
    }

    protected setEventsPublisher(): void {
        // intentionally left empty
    }

    protected registerEventsSubscribers(): void {
        // intentionally left empty
    }

    protected setApplicationServices(): void {
        // intentionally left empty
    }

    private setMiddlewares(): void {
        this._express.use(cors())
        this._express.use(morgan('dev'))
        this._express.use(bodyParser.json())
        this._express.use(bodyParser.urlencoded({extended: false}))
        this._express.use(helmet())
    }

    private setUpSwagger(): void {
        const swaggerSpec = swaggerJSDoc(this.getSwaggerOptions())

        this._express.use(
            '/api/' + process.env.API_VERSION + '/docs',
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec, {
                explorer: true,
            })
        )
    }

    private catchErrors(): void {
        this._express.use(notFound)
        this._express.use(internalServerError)
    }
}

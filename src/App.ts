import express, { Express } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import keycloak from './middlewares/keycloak';
import swaggerUi from 'swagger-ui-express'
import router from './routes'

class App {
    public app: Express;
    public port: Number;

    constructor(port: Number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares() {
        // Swagger
        this.app.use(express.static("dist"));
        this.app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                url: "/swagger.json",
                },
            })
        );

        // Authentication
        // this.app.use(keycloak);

        this.app.use(json());
        this.app.use(cors());

        // Artificial latency
        // this.app.use(function(req,res,next){setTimeout(next,1000)});
    }

    private initializeRoutes() {
        this.app.use(router);        
    }

    public listen() {
        // For local development
        this.app.listen(this.port, () => { 
        // For docker development
        // this.app.listen(`10.10.0.11:${this.port}`, () => {
            console.log(`[server]: Listening on http://localhost:${this.port}`);
        });
    }
}

export default App;
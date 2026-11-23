import express, {Application, Request, Response} from "express" ;
//import userRoutes from './routes/ 
import launchRoutes from './routes/launches';
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { logger } from "./middleware/logger.middleware";
import swaggerUi from 'swagger-ui-express' 
import { swaggerSpec } from "./config/swagger";
import cors from 'cors';
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from './routes/auth';


const port = env.port;

export const app: Application = express();

app.use(
'/api-docs',
swaggerUi.serve,
swaggerUi.setup(swaggerSpec)
);

app.use(logger);
app.use(express.json());
app.use(cors());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/launches', launchRoutes);


app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "This is the Web Programming 2 assignment!" 
    });
});

app.use(errorHandler)

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

};

startServer();

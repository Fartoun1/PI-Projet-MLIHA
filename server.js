import express from 'express';
import mongoose from 'mongoose'; 
import morgan from 'morgan';
import cors from 'cors';
import { notFoundError, errorHandler } from './middlewares/error-handler.js';

import userRoutes from './routes/userRoutes.js';

//connexion server base de donnée----------------
const app = express();
const port = process.env.PORT || 9090;    //numero de port 9090
const databaseName = 'MLIHA';             // base de donnée
const db_url = process.env.DB_URL || `mongodb://127.0.0.1:27017`;
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`${db_url}/${databaseName}`)
  .then(() => { console.log(`Connected to ${databaseName}`); })
  .catch(err => { console.log(err);   });

//definir les routes -----------------------

app.use(express.json()); // Middleware pour analyser le corps des requêtes JSON
app.use(morgan('dev'));
app.use(cors());
app.use("/User", userRoutes);
app.use(notFoundError);
app.use(errorHandler);

app.listen(port , ()=> { console.log(`SERVER running at http://localhost:${port}/`)})

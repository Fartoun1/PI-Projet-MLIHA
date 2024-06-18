import express from "express";
import mongoose from "mongoose";
import morgan from 'morgan'; // Importer morgan
import cors from 'cors'; // Importer cors

import reclamation from './routes/reclamation.js';
import categorieReclamation from './routes/categorieReclamation.js';

import indexRoutes from "./routes/routes.js";

import clientRoutes from './routes/client.js';
import categorieclientRoutes from './routes/categorieclient.js';

import userRoutes from './routes/userRoutes.js';

import cron from 'node-cron';
import { sendPersonalizedMessages } from './controllers/client.js';

import { notFoundError, errorHandler } from "./middlewares/error-handler.js";

const app = express();
const port = process.env.PORT || 9090;
const databaseName = "E-MLIHA";

mongoose.set("debug", true);
mongoose.Promise = global.Promise;



mongoose
  .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });




app.use(cors()); // Utiliser CORS
app.use(morgan('dev')); // Utiliser morgan
app.use(express.json()); // Pour analyser application/json
app.use(express.urlencoded({ extended: true })); // Pour analyser application/x-www-form-urlencoded
app.use('/img', express.static('public/images')); // Servir les fichiers sous le dossier public/images

// A chaque requête, exécutez ce qui suit
app.use((req, res, next) => {
  console.log("Middleware just ran !");
  next();
});

app.use(indexRoutes);

app.use('/reclamations', reclamation);
app.use('/categorieReclamations', categorieReclamation);

app.use('/client', clientRoutes);
app.use('/categorieclient', categorieclientRoutes);


app.use('/api', clientRoutes);  

app.use("/User", userRoutes);


app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Schedule the sendPersonalizedMessages function to run daily at midnight
cron.schedule('0 0 * * *', () => {
  sendPersonalizedMessages();
});

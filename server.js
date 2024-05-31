import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'; // Importer morgan
import cors from 'cors'; // Importer cors


import client from './routes/client.js';
import reclamation from './routes/reclamation.js';
import categorieReclamation from './routes/categorieReclamation.js';

const app = express();
const port = process.env.PORT || 9090;
const databaseName = 'WorkshopPI';

mongoose.set('debug', true);
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

app.use('/clients', client);
app.use('/reclamations', reclamation);
app.use('/categorieReclamations', categorieReclamation);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
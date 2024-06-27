// routes/client.js
import express from 'express';
import {
  addOnce,
  getOnce,
  deleteOnce,
  patchOnce,
  filterByRegion,
  calculateAnciennete,
  searchClients,
  filterByCategorieClient,
  exportClientsToPDF,
  sendPersonalizedMessages,
  getMany,
  getClientStatistics // Assurez-vous d'importer cette fonction
} from '../controllers/client.js';
 
const router = express.Router();
router.get('/statistics', getClientStatistics); // Route pour obtenir les statistiques
 
router.post('/', addOnce);
router.get('/', getMany);
router.get('/search', searchClients);  // Route for multiple search
router.get('/:id', getOnce);
router.delete('/:id', deleteOnce);
router.patch('/:id', patchOnce);
router.get('/filter/categorieclient/:categorieClientId', filterByCategorieClient);
router.get('/filter/region/:region', filterByRegion);
router.get('/calculateAnciennete/:id', calculateAnciennete);
router.get('/export/pdf', exportClientsToPDF);  // Route for PDF export
 
router.post('/send-personalized-messages', sendPersonalizedMessages); // Route for personalized messages
 
export default router;
 
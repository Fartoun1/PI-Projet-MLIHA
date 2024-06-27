import express from 'express';
import { addOnce, getOnce, deleteOnce, patchOnce, filterByRegion, calculateAnciennete, searchClients, filterByCategorieClient, exportClientsToPDF, sendPersonalizedMessages, getMany } from '../controllers/client.js';

const router = express.Router();

router.post('/', addOnce);
router.get('/', getMany);
router.get('/search', searchClients);  // Ajoutez cette ligne pour la recherche multiple
router.get('/:id', getOnce);
router.delete('/:id', deleteOnce);
router.patch('/:id', patchOnce);
router.get('/filter/categorieclient/:categorieClientId', filterByCategorieClient);
router.get('/filter/region/:region', filterByRegion);
router.get('/anciennete/:id', calculateAnciennete);
router.get('/search', searchClients);  // Ajoutez cette ligne pour la recherche multiple
router.get('/export/pdf', exportClientsToPDF);  // Ajoutez cette ligne pour l'exportation PDF
router.post('/send-personalized-messages', sendPersonalizedMessages); // Add this line for personalized messages

export default router;

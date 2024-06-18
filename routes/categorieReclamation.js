import express from 'express';
import {  addOnce, getAll, getOnce, updateOne, deleteOne, updateField } from '../controllers/categorieReclamation.js';

const router = express.Router();

router
  .route('/')
  .post(addOnce)
  .get(getAll);

router
  .route('/:id')
  .get(getOnce);

router
  .route('/:id')
  .put(updateOne)
  .delete(deleteOne)
  .patch(updateField);  

export default router;
import express from 'express';
import {  addOnce, getAll, getOnce } from '../controllers/client.js';
  
const router = express.Router();

router
  .route('/')
  .post(addOnce)
  .get(getAll);

router
  .route('/:id')
  .get(getOnce);

export default router;
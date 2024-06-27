import express from "express";

import multer from "../middlewares/multer-config-local.js";

import {  addOnce, getAll, getOnce, updateOne, deleteOne, updateField, getReclamation, sendEmail}
from '../controllers/reclamation.js';
  
const router = express.Router();

router
  .route("/")
  .post(multer("image", 5 * 1024 * 1024), addOnce)
  .get(getAll);

router
  .route('/:idClient')
  .put(multer("image", 5 * 1024 * 1024), 
    updateOne)
  .get(getOnce);

  router
  .route('/:id')
  .delete(deleteOne)
  .patch(updateField);

router
  .route('/rec/:id')
  .get(getReclamation);  

router
  .route('/sendEmail')
  .post(sendEmail);  


export default router;

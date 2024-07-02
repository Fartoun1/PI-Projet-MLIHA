import express from "express";
import upload from "../middlewares/multer-config.js";

import {
  addOnce,
  getAll,
  updateOne,
  deleteOne,
  getOne,
  getProductByCategorie,
} from "../controllers/produit.js";

const router = express.Router();

router.route("/").get(getAll).post(upload.single("image"), addOnce);
router.route("/categorie/:id").get(getProductByCategorie);
router
  .route("/:id")
  .get(getOne)
  .patch(upload.single("image"), updateOne)
  .delete(deleteOne);

export default router;

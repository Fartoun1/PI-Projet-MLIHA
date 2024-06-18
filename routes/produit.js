import express from "express";
import upload from "../middlewares/multer-config.js";

import {
  addOnce,
  getAll,
  updateOne,
  deleteOne,
  getOne,
} from "../controllers/produit.js";

const router = express.Router();

router.route("/").get(getAll).post(upload.single("image"), addOnce);
router.route("/:id").get(getOne).put(updateOne).delete(deleteOne);

export default router;

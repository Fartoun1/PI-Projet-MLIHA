import express from "express";

import {
  addOnce,
  getAll,
  updateOne,
  deleteOne,
  getOnce,
} from "../controllers/categorieProduit.js";

const router = express.Router();

router.route("/").get(getAll).post(addOnce);
router.route("/:id").get(getOnce).put(updateOne).delete(deleteOne);

export default router;

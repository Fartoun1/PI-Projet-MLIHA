import express from "express";
import {
  getAll,
  addOnce,
  updateOne,
  deleteOne,
  getOnce,
  deleteIn,
  getOnceByIdClient,
} from "../controllers/achat.js";
const router = express.Router();

router.route("/").get(getAll).post(addOnce);
router.route("/client/:idClient").get(getOnceByIdClient);
router.route("/id/:idAchat").get(getOnce).delete(deleteOne);
router.route("/:idAchat/:idProduit").put(updateOne);
router.route("/delete/:idAchat/:idProduit").put(deleteIn);

export default router;

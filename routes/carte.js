import express from "express";
import { cartController } from "../controllers/carte.js";

const router = express.Router();

router.post("/add-to-cart", cartController.addToCart);
router.put("/confirm-purchase", cartController.confirmPurchase);
router.get("/get-cart/:idClient", cartController.getCart);
router.get("/get-orders/:idClient", cartController.getOrders);
router.delete("/delete-cart/:idClient", cartController.deleteOne);
router.put("/update-cart", cartController.updatePanier);

export default router;

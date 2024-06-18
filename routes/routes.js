import produitRoutes from "./produit.js";
import categorieProduitRoutes from "./categorieProduit.js";
import achatRoutes from "./achat.js";
import express from "express";

const router = express.Router();
router.use("/produit", produitRoutes);
router.use("/categorie", categorieProduitRoutes);
router.use("/achat", achatRoutes);

export default router;

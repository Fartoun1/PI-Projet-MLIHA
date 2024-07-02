import produitRoutes from "./produit.js";
import categorieProduitRoutes from "./categorieProduit.js";
import achatRoutes from "./achat.js";
import carteRoutes from "./carte.js";
import express from "express";

const router = express.Router();
router.use("/carte", carteRoutes);
router.use("/produit", produitRoutes);
router.use("/categorie", categorieProduitRoutes);
router.use("/achat", achatRoutes);

export default router;

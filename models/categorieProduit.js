import mongoose from "mongoose";
import Produit from "../models/produit.js";
const { Schema, model } = mongoose;

const categorieProduitScehma = new Schema({
  nomCategorie: {
    type: String,
    required: true,
  },
  descriptionCategorie: {
    type: String,
    required: true,
  },
});

categorieProduitScehma.post("findOneAndDelete", async function (doc, next) {
  try {
    await Produit.deleteMany({ categorie: doc._id });
    console.log(`categorie n° ${doc._id} a été supprimé`);
    next();
  } catch (e) {
    console.error(e.message);
  }
});

export default model("CategorieProduit", categorieProduitScehma);

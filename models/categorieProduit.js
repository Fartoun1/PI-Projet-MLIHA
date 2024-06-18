import mongoose from "mongoose";
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

export default model("CategorieProduit", categorieProduitScehma);

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const produitSchema = new Schema({
  categorie: {
    type: Schema.Types.ObjectId,
    ref: "CategorieProduit",
    required: true,
  },
  nomProduit: {
    type: String,
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  descriptionProduit: {
    type: String,
    required: true,
  },
  quantite: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default model("Produit", produitSchema);

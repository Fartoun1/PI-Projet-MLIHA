import mongoose from "mongoose";
import Cart from "../models/carte.js";
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

produitSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    if (doc) {
      // Find all carts containing the deleted product
      await Cart.updateMany(
        { "items.product": doc._id },
        { $pull: { items: { product: doc._id } } }
      );
      console.log(
        `Product with ID ${doc._id} has been removed from all carts.`
      );
    }
    next();
  } catch (e) {
    console.error(e.message);
    next(e);
  }
});

export default model("Produit", produitSchema);

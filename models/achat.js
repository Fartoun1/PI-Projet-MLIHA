import mongoose from "mongoose";
const { Schema, model } = mongoose;

const achatScehma = new Schema(
  {
    commande: {
      type: [
        {
          idClient: Number,
          idProduit: Schema.Types.ObjectId,
          quantite: Number,
          prix: Number,
          total: Number,
          dateAchat: { type: Date, default: new Date() },
        },
      ],
      required: true,
    },
    somme: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Achat", achatScehma);

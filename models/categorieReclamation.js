import mongoose, { Schema, model } from "mongoose";

const categorieReclamation = new Schema({

    libelleCategorie: {
        type: String,
        required: [true, 'libelleCategorie is required'],
    },
    description: {
        type: String
        }
},
    {
        timestamps: true
    }
);

export default model("CategorieReclamation", categorieReclamation);
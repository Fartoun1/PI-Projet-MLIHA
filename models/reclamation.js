import mongoose, { Schema, model } from "mongoose";

const reclamationSchema = new Schema({
    
    idClient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    idCategorieReclamation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'CategorieReclamation'
    },
    title: {
        type: String,
        required: [true, 'description is required'],
    },
    description: {
        type: String,
        required: [true, 'description is required'],
    },
    priorite: {
        type: String,
    },
    dateReclamation: {
        type: Date,
        default: Date.now
    },
    statut_rec: {
        type: String,
        required: [true, 'statut reclamation is required'],
    },
    satisfaction: {
        type: String
    },
    notes: {
        type: String
    },
    notification: {
        type: String
    },
    image: {
        type: String
    }
},
    {
        timestamps: true
    }
);

export default model("Reclamation", reclamationSchema);
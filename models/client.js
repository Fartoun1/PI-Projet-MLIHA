import { Schema, model } from "mongoose";

const clientSchema = new Schema({
    nom: {
        type: String,
    },
    prenom: {
        type: String,
    },
    adresse: {
        type: String,
    },
    tele: {
        type: String,
    }
},
    {
        timestamps: true
    }
);

export default model("Client", clientSchema);
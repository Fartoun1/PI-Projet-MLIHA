import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const clientSchema = new Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
        maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est requis'],
        minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
        maxlength: [100, 'Le prénom ne peut pas dépasser 100 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        match: [/.+\@.+\..+/, 'L\'email doit être valide']
    },
    addressePostal: {
        type: String,
        required: [true, 'L\'adresse postale est requise'],
        minlength: [10, 'L\'adresse postale doit contenir au moins 10 caractères'],
        maxlength: [200, 'L\'adresse postale ne peut pas dépasser 200 caractères']
    },
    telPortable: {
        type: String,
        required: [true, 'Le téléphone portable est requis'],
        match: [/^\+\d{1,3}\d{4,14}(?:x\d+)?$/, 'Le téléphone portable doit être valide']
    },
    telFixe: {
        type: Number,
        required: [true, 'Le téléphone fixe est requis'],
        min: [10000000, 'Le téléphone fixe doit contenir au moins 8 chiffres'],
        max: [99999999, 'Le téléphone fixe ne peut pas dépasser 8 chiffres']
    },
    matriculeFiscale: {
        type: Number,
        required: [true, 'La matricule fiscale est requise'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: props => `La matricule fiscale doit contenir exactement 8 chiffres.`
        }
    },
    dateInscription: {
        type: Date,
        required: [true, 'La date d\'inscription est requise']
    },
    chiffreAffaire: {
        type: Number,
        required: [true, 'Le chiffre d\'affaires est requis'],
        min: [0, 'Le chiffre d\'affaires doit être au moins 0']
    },
    niveauSatisfaction: {
        type: Number,
        required: [true, 'Le niveau de satisfaction est requis'],
        min: [1, 'Le niveau de satisfaction doit être au moins 1'],
        max: [5, 'Le niveau de satisfaction ne peut pas dépasser 5']
    },
    statutCompte: {
        type: String,
        required: [true, 'Le statut du compte est requis'],
        enum: ['actif', 'inactif', 'suspendu']
    },
    region: {
        type: String,
        required: [true, 'La région est requise'],
        minlength: [2, 'La région doit contenir au moins 2 caractères'],
        maxlength: [100, 'La région ne peut pas dépasser 100 caractères']
    },
    pointFidelite: {
        type: Number,
        required: true,
        default: 100
    },
    categorieClientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorieclient',
        required: [true, 'L\'ID de la catégorie client est requis']
    }
});

export default model("Client", clientSchema);

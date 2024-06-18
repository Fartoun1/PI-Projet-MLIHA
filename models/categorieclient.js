import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categorieclientSchema = new Schema({
    libelleCatCl: {
        type: String,
        required: [true, 'Libellé de la catégorie client est requis'],
        minlength: [3, 'Le libellé doit contenir au moins 3 caractères'],
        maxlength: [50, 'Le libellé ne peut pas dépasser 50 caractères']
    },
    descriptionCatCl: {
        type: String,
        required: [true, 'Description de la catégorie client est requise'],
        minlength: [10, 'La description doit contenir au moins 10 caractères'],
        maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    promotionCatCl: {
        type: Number,
        required: [true, 'Promotion de la catégorie client est requise'],
        min: [0, 'La promotion doit être au moins 0'],
        max: [100, 'La promotion ne peut pas dépasser 100']
    }
});

export default model("Categorieclient", categorieclientSchema);

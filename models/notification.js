/*import mongoose, { Schema, model } from "mongoose";

const reclamationSchema = new Schema({
    
    idClient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    idReclamation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Reclamation'
    },  
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },     
    message: {
        type: String,
        required: [true, 'description is required'],
    },
    satisfaction: {
        type: String
    }
},
    {
        timestamps: true
    }
);

export default model("Notification", notificationSchema);


*/
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        id_user: {type: String, },
        nom:     {type: String,     },
        prenom:  { type: String,   },
        entreprise:  { type: String},
        matriculeFiscal: {type :String},
        email: { type: String, required :true },
        motPasse: { type: String         },
        motPassH:{ type: String         },
        address: {  type: String,  },
        mobile:{   type:Number,     },
        role:{type: String, },      
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }

    },
    {
        timestamps: true
    }
);

export default model('User', userSchema);
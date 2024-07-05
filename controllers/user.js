import {validationResult} from 'express-validator';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


// ------> CRUD USER
// Ajout d'un utilisateur
export const addOnce = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(400).json(errors.array());
  }
  await createUser(req, res);
}; 
export function getAll(req,res){

    User.find({})
    .then((docs) => {
            let list = [];
            for (let i = 0; i < docs.length; i++) 
              {
              list.push({
                id: docs[i]._id,
                nom: docs[i].nom,
                prenom: docs[i].prenom,
                entreprise: docs[i].entreprise,
                maticuleFiscal:docs[i].maticuleFiscal,
                email: docs[i].email,
                motPasse: docs[i].motPasse,
                address: docs[i].address,
                mobile : docs[i].mobile,
                role: docs[i].role

              });
            }
          res.status(200).json(list);     })
          .catch((err) => { res.status(500).json({ error: err });     });
      }

export function getOnce(req, res) {
  User.findById(req.params.id)
    .select('nom prenom entreprise matriculeFiscal address mobile -_id')
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}


export function putOnce (req,res){
  let newUser ={};
  if (req.file == undefined )
    {
    newUser= {
    nom: req.body.nom,
    prenom : req.body.prenom,
    entreprise : req.body.entreprise,
    matriculeFiscal : req.body.matriculeFiscal,
    email : req.body.email,
    motPasse :req.body.motPasse,
    motPassH:req.body.motPassH,
    address : req.body.address,
    mobile : req.body.mobile,
    role: req.body.role
  }
}
else  {
      newUser= {
            nom: req.body.nom,
            prenom : req.body.prenom,
            entreprise : req.body.entreprise,
            matriculeFiscal : req.body.matriculeFiscal,
            email : req.body.email,
            motPasse :req.body.motPasse,
            motPassH:req.body.motPassH,
            address : req.body.address,
            mobile : req.body.mobile,
            role: req.body.role
  
  }
}

User.findByIdAndUpdate(req.params.id, newUser)
.then((doc1)=>{
    User.findById(req.params.id)
        .then((doc2) => { res.status(200).json(doc2);   })
        .catch((err) => { res.status(500).json({ error: err }); }); 
     })
    .catch((err) => {res.status(500).json({ error: err });  });
}

export function deleteOnce(req, res) 
{
    User.findByIdAndDelete(req.params.id)
        .then(deletedUser => {
                if (!deletedUser) 
                    {
                    return res.status(404).json({ message: "user not found" }); 
                    }
                res.status(200).json({ message: `user deleted successfully` });
                  })
    .catch(err => res.status(500).json({ error: err.message }));
}


//------X  Fonction pour créer un utilisateur
const createUser = async (req, res) => {
  const { nom, prenom, entreprise, matriculeFiscal, email, motPasse, address, mobile, role } = req.body;
  if ( !email || !motPasse ) {
          return res.status(400).json({ message: 'Missing required fields' });
      }

  try {
      const existingUser = await User.findOne({ email });  
      if (existingUser) {
          return res.status(400).json({ message: 'Email deja utilisée' });
      }

      const hashedPassword = await bcrypt.hash(motPasse, 12);
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

      const newUser = new User({ 
        nom, 
        prenom, 
        entreprise, 
        matriculeFiscal, 
        email, 
        motPasse:hashedPassword, 
        address, 
        mobile, 
        role:"admin",
        verificationCode, 
        isVerified: false 
      });
      
        const savedUser = await newUser.save();

        // Envoyer l'email de vérification
        const mailOptions = {
          to: savedUser.email,
          from: 'mliha@gmail.com',
          subject: 'Vérification de votre compte',
          text: `Votre code de vérification est: ${verificationCode}`
        };
        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            return res.status(500).json({ message: 'Error sending email', error: err });
          }
          res.status(201).json({ message: 'Account created. Verification code sent to email.', user: savedUser });
        });

       } 
       catch (err) {res.status(500).json({ error: err.message }); }
};

export const verifyUser = async (req, res) => {
  const { email, code } = req.body;

  console.log("Received email:", email);
  console.log("Received code:", code);

  try {
    const user = await User.findOne({ email, verificationCode: code });
    if (!user) {
      console.log("User not found or invalid code");
      return res.status(400).json({ message: 'Invalid code or email' });
    }

    user.isVerified = true;
    user.verificationCode = undefined; // Optional: Remove the code after verification

    await user.save();
    
    res.status(200).json({ message: 'User verified successfully' });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ error: err.message });
  }
};


// SIGNUP
export const signUp = async (req, res) => {
  await createUser(req, res);
};

//  LOGIN+creation token
export const signIn = async (req, res) => {
    const { email, motPasse } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        console.log('Stored password:', existingUser.motPasse);

        const isPasswordCorrect = await bcrypt.compare(motPasse, existingUser.motPasse);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid mot de passe' });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'secret', { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });
    } 
    catch (err) { 
      console.error(err);
      res.status(500).json({ error: err.message });
    }
};
export const getUserSession = async (req, res) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedData = jwt.verify(token, secret);

      const user = await User.findById(decodedData.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};
  
// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: '9d806df70e84e5',
    pass: 'b84cc0f556e0d5',
  }
});

export const forgetPassword = async (req, res) => {

    const { email } = req.body;
  
    try {
        const user = await User.findOne({ email });
        if (!user) { return res.status(404).json({ message: 'User not found' });
        }
          
        const token = crypto.randomBytes(20).toString('hex'); // Générer un token de réinitialisation
        user.resetPasswordToken = token;  // Définir le token et sa date d'expiration
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
  
        await user.save();
  
        // Envoyer l'email de réinitialisation
        const mailOptions = {
            to: user.email,
            from: 'mliha.bardo@gmail.com',
            subject: 'Changer mot de passe',
            html: `
        <p>You are receiving this because you have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="http://localhost:4200/#/change-password/${token}">Reset Password</a>
      `
                    };
      
      transporter.sendMail(mailOptions, (err, response) => {
          if (err) { 
              return res.status(500).json({ message: 'Error envoie email', error: err });
          }
                      res.status(200).json({ message: 'Recovery email envoyer' });
      });
      
  } catch (err) { res.status(500).json({ error: err.message });  }
  };


  export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    console.log(token, newPassword);
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid token or token has expired' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.motPasse = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

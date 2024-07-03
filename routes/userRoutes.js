import express from "express";
import { body} from 'express-validator';
import auth  from '../middlewares/auth.js';
import { addOnce, getAll, getOnce, deleteOnce,putOnce, signIn, signUp, getUserSession,forgetPassword, resetPassword, verifyUser } from '../controllers/user.js';  


// import multer from "../middlewares/multer-config.js";
// importer les 4 fonction du CRUD 

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    body("nom"),
    body("prenom"),
    body("entreprise"),
    body("matriculeFiscal"),
    body("email"),
    body("motPasse"),
    body("motPassH"),
    body("address"),
    body("mobile"),
    body("role"),

   addOnce
  );

router
  .route("/:id")
  .delete(deleteOnce)
  .get(getOnce)
  .put(
    body("nom"),
    body("prenom"),
    body("entreprise"),
    body("matriculeFiscal"),
    body("email"),
    body("motPasse"),
    body("motPassH"),
    body("address"),
    body("mobile").isNumeric(),
    body("role"),
    
    putOnce
  );

  router.route("/signup").post(signUp),
  router.route('/verify').post(verifyUser);
  router.route("/signin").post(signIn),
  router.get('/session', auth, getUserSession);
  router.route("/forgetpassword").post(forgetPassword),
  router.route("/resetpassword").post(resetPassword);

export default router;

import express from "express";
import { body} from 'express-validator';

// import multer from "../middlewares/multer-config.js";
// importer les 4 fonction du CRUD 
import { addOnce, getAll, getOnce, deleteOnce,putOnce, signIn, signUp,forgetPassword, resetPassword } from '../controllers/user.js';  


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
    body("nom").isLength({ min: 5 }),
    body("prenom").isLength({ min: 5 }),
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
  router.route("/signin").post(signIn),
  router.route("/forgetpassword").post(forgetPassword),
  router.route("/reset/:token").post(resetPassword);

export default router;

import Produit from "../models/produit.js";
import categorieProduit from "../models/categorieProduit.js";
import cloudinary from "../utils/cloudinary.js";
export async function addOnce(req, res) {
  try {
    const categorie = await categorieProduit.findById({
      _id: req.body.categorie,
    });
    if (!categorie) {
      return res.status(404).json({ message: "categorie not found" });
    } else {
      const result = await cloudinary.uploader.upload(req.file.path);

      const produit = await Produit.create({
        categorie: req.body.categorie,
        nomProduit: req.body.nom.toLowerCase(),
        prix: req.body.prix,
        quantite: req.body.quantite,
        descriptionProduit: req.body.description,
        //image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
        image: result.secure_url,
      });
      res.status(200).json(produit);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function getAll(req, res) {
  try {
    const produits = await Produit.find().populate("categorie").exec();
    res.status(200).json(produits);
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function getOne(req, res) {
  try {
    const produit = await Produit.findById(req.params.id)
      .populate("categorie")
      .exec();
    res.status(200).json(produit);
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function updateOne(req, res) {
  try {
    const produit = await Produit.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.status(200).json({ message: "update successfully", produit });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function deleteOne(req, res) {
  try {
    const produit = await Produit.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "delete successfully" });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

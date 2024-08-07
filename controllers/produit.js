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
      if (!result) {
        return res.status(500).json({ message: "error upload image" });
      } else {
        const produit = await Produit.create({
          categorie: req.body.categorie,
          nomProduit: req.body.nomProduit.toLowerCase(),
          prix: req.body.prix,
          quantite: req.body.quantite,
          descriptionProduit: req.body.descriptionProduit,
          //image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
          image: result.secure_url,
        });
        res.status(200).json(produit);
      }
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

export async function getProductByCategorie(req, res) {
  try {
    const produits = await Produit.find({ categorie: req.params.id })
      .populate("categorie")
      .exec();
    res.status(200).json(produits);
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
}

export async function updateOne(req, res) {
  try {
    console.log(req.body.nomProduit);
    const categorie = await categorieProduit.findById(req.body.categorie);
    if (!categorie) {
      return res.status(404).json({ message: "categorie not found" });
    } else {
      const result = await cloudinary.uploader.upload(req.file.path);
      if (!result) {
        return res.status(500).json({ message: "error upload image" });
      } else {
        const produit = await Produit.findByIdAndUpdate(
          { _id: req.params.id },
          {
            categorie: req.body.categorie,
            nomProduit: req.body.nomProduit.toLowerCase(),
            prix: req.body.prix,
            quantite: req.body.quantite,
            descriptionProduit: req.body.descriptionProduit,
            image: result.secure_url,
          }
        );
        console.log({ produit });
        res.status(200).json({
          message: "product updated successfully",
          produit,
        });
      }
    }
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

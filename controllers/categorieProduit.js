import CategorieProduit from "../models/categorieProduit.js";

export function addOnce(req, res) {
  try {
    const categorieProduit = CategorieProduit.create({
      nomCategorie: req.body.nom.toLowerCase(),
      descriptionCategorie: req.body.description,
    });
    res.status(200).json({ message: "added successfully", categorieProduit });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function getAll(req, res) {
  try {
    const categorie = await CategorieProduit.find();
    res.status(200).json({ categorie });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function getOnce(req, res) {
  try {
    const categorie = await CategorieProduit.findById({ _id: req.params.id });
    res.status(200).json({ categorie });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function updateOne(req, res) {
  try {
    const categorie = await CategorieProduit.findByIdAndUpdate(
      { _id: req.params.id },
      {
        nomCategorie: req.body.nom.toLowerCase(),
        descriptionCategorie: req.body.description,
      }
    );
    res.status(200).json({ message: "update successfully", categorie });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

export async function deleteOne(req, res) {
  try {
    const categorie = await CategorieProduit.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).json({ message: "delete successfully" });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

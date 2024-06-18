import mongoose from "mongoose";
import Achat from "../models/achat.js";
import Produit from "../models/produit.js";

export async function addOnce(req, res) {
  try {
    const { idClient, idProduit, quantite, prix, dateAchat } = req.body;
    const commande = [];
    const stock = [];
    let message = "";

    for (let i = 0; i < idProduit.length; i++) {
      const index = commande.findIndex((x) => x.idProduit == idProduit[i]);
      const produit = await Produit.findById({ _id: idProduit[i] });
      if (!produit) {
        console.log("produit not found");
      } else {
        if (produit.quantite < quantite[i]) {
          message = `Probléme stoke : le produit n°${produit.id} n'est disponoble que en ${produit.quantite} quantité`;

          break;
        } else if (index == -1 && produit.quantite >= quantite[i]) {
          commande.push({
            idClient: idClient[i],
            idProduit: idProduit[i],
            quantite: quantite[i],
            prix: produit.prix,
            total: produit.prix * quantite[i],
          });
          stock.push({
            idProduit: produit.id,
            solde: produit.quantite - quantite[i],
          });
        } else if (stock[index].solde < quantite[i]) {
          message = `probléme stoke : il reste que ${stock[index].solde}  unité du produit N°${stock[index].idProduit}`;

          break;
        } else if (index != -1 && stock[index].solde >= quantite[i]) {
          commande[index].quantite += quantite[i];
          commande[index].total =
            commande[index].quantite * commande[index].prix;
          stock[index].solde -= quantite[i];
        }
      }
    }

    if (message) {
      return res.status(400).json({ message });
    } else {
      const total = commande.reduce(
        (accumulator, currentValue) => accumulator + currentValue.total,
        0
      );
      const achat = await Achat.create({
        commande: commande,
        somme: total,
      });
      for (let i = 0; i < stock.length; i++) {
        const updateProduit = await Produit.findByIdAndUpdate(
          { _id: stock[i].idProduit },
          { quantite: stock[i].solde }
        );
      }

      res.status(200).json({ message: "purchase add successfully", achat });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getAll(req, res) {
  try {
    const achat = await Achat.find();
    res.status(200).json({ message: "purchase list", achat });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
export async function getOnce(req, res) {
  try {
    const achat = await Achat.findById({ _id: req.params.idAchat });
    res.status(200).json(achat);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateOne(req, res) {
  try {
    let newAchat;
    let newProduit;
    const produit = await Produit.findById({ _id: req.params.idProduit });
    const achat = await Achat.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.idAchat) } },
      { $unwind: "$commande" },
      {
        $match: {
          "commande.idProduit": new mongoose.Types.ObjectId(
            req.params.idProduit
          ),
        },
      },
    ]);
    if (achat.length > 0) {
      const result = achat[0];

      if (req.body.quantite > result.commande.quantite) {
        const newQuantite = req.body.quantite - result.commande.quantite;
        if (newQuantite > produit.quantite) {
          res
            .status(400)
            .json({ message: "quantité n'est pas disponible en stock" });
        } else {
          const difference = newQuantite * result.commande.prix;
          const newSomme = difference + result.somme;
          newAchat = await Achat.findOneAndUpdate(
            {
              "commande.idProduit": req.params.idProduit,
            },
            {
              $set: {
                "commande.$.quantite": req.body.quantite,
                "commande.$.total": req.body.quantite * result.commande.prix,
                somme: newSomme,
              },
            },
            { new: true }
          );
          newProduit = await Produit.findByIdAndUpdate(
            { _id: req.params.idProduit },
            { quantite: produit.quantite - newQuantite }
          );
          res.status(200).json({ mesg: "update successfully", newAchat });
        }
      } else if (req.body.quantite < result.commande.quantite) {
        const newQuantite = result.commande.quantite - req.body.quantite;
        const difference = newQuantite * result.commande.prix;
        const newSomme = result.somme - difference;
        newAchat = await Achat.findOneAndUpdate(
          {
            "commande.idProduit": req.params.idProduit,
          },
          {
            $set: {
              "commande.$.quantite": req.body.quantite,
              "commande.$.total": req.body.quantite * result.commande.prix,
              somme: newSomme,
            },
          },
          { new: true }
        );
        newProduit = await Produit.findByIdAndUpdate(
          { _id: req.params.idProduit },
          { quantite: produit.quantite + newQuantite }
        );
        res.status(200).json({ mesg: "update successfully", newAchat });
      } else {
        newAchat = await Achat.findOne({ "commande._id": req.params.idAchat });
        res.status(200).json({ mesg: "la quantite est la même", newAchat });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteIn(req, res) {
  try {
    let newAchat;
    const produit = await Produit.findById({ _id: req.params.idProduit });
    const achat = await Achat.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.idAchat) } },
      { $unwind: "$commande" },
      {
        $match: {
          "commande.idProduit": new mongoose.Types.ObjectId(
            req.params.idProduit
          ),
        },
      },
    ]);

    if (achat.length > 0) {
      const result = achat[0];
      const newSomme = result.somme - result.commande.total;
      newAchat = await Achat.findOneAndUpdate(
        {
          "commande.idProduit": req.params.idProduit,
        },
        {
          $set: {
            somme: newSomme,
          },

          $pull: {
            commande: {
              idProduit: req.params.idProduit,
            },
          },
        },
        { new: true }
      );
      const newProduit = await Produit.findByIdAndUpdate(
        { _id: req.params.idProduit },
        { quantite: produit.quantite + result.commande.quantite }
      )
        .status(200)
        .json({ message: "delete ligne commande successfully", newAchat });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteOne(req, res) {
  try {
    const refAchat = await Achat.findById({ _id: req.params.idAchat });

    refAchat.commande.map(async (c) => {
      const produit = Produit.findById({ _id: c.idProduit });
      await Produit.findByIdAndUpdate(
        { _id: c.idProduit },
        { quantite: produit.quantite + c.quantite }
      );
    });
    const achat = await Achat.findByIdAndDelete({ _id: req.params.idAchat });
    res.status(200).json({ message: "delete Achat successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

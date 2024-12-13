import Cart from "../models/carte.js";
import Produit from "../models/produit.js";

export const cartController = {
  // Ajouter un produit au panier
  addToCart: async (req, res) => {
    try {
      const { idClient, idProduit, quantity } = req.body;

      // Vérifier si le produit est en stock
      const productInStock = await Produit.findById(idProduit);
      if (!productInStock) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      if (productInStock.quantite < quantity) {
        return res
          .status(400)
          .json({ message: "Quantité demandée non disponible en stock" });
      }

      // Ajouter le produit au panier
      let cart = await Cart.findOne({ user: idClient });
      if (!cart) {
        cart = await Cart.create({
          user: idClient,
          items: [{ product: idProduit, quantity, status: "panier" }],
          totalAmount: quantity * productInStock.prix,
        });
      } else {
        const existingItem = cart.items.find(
          (item) =>
            item.product.toString() === idProduit.toString() &&
            item.status === "panier"
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ product: idProduit, quantity });
        }
        // Calculer le montant total pour les produits avec le statut "panier"
        cart.totalAmount = cart.items
          .filter((item) => item.status === "panier")
          .reduce(
            (total, item) => total + item.quantity * productInStock.prix,
            0
          );

        await cart.save();
      }

      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updatePanier: async (req, res) => {
    try {
      const { idClient, idProduit } = req.body;

      let cart = await Cart.findOne({ user: idClient })
        .populate("items.product")
        .exec();

      if (!cart) {
        return res.status(404).json({ message: "Panier non trouvé" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.equals(idProduit) && item.status === "panier"
      );

      if (itemIndex !== -1) {
        // Supprimer le produit du panier
        const oldQuantity = cart.items[itemIndex].quantity;
        const productPrice = cart.items[itemIndex].product.prix;

        cart.items.splice(itemIndex, 1);

        // Recalculer le totalAmount pour les produits avec le statut "panier"
        cart.totalAmount = cart.items
          .filter((item) => item.status === "panier")
          .reduce(
            (total, item) => total + item.quantity * item.product.prix,
            0
          );

        await cart.save();
        res.status(200).json(cart);
      } else {
        res
          .status(404)
          .json({ message: "Produit n'existe pas dans le panier" });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  // Valider un produit dans la commande
  confirmPurchase: async (req, res) => {
    try {
      const { carte } = req.body;

      // Trouver le panier de l'utilisateur
      const userCart = await Cart.findById(carte._id)
        .populate("items.product")
        .exec();

      if (!userCart) {
        return res.status(404).json({ message: "Panier non trouvé" });
      }

      // Parcourir les produits de la carte passée en paramètre pour vérifier les quantités
      for (const item of carte.items) {
        const product = await Produit.findById(item.product);

        if (product.quantite < item.quantity) {
          return res.status(200).json({
            erreur: `Le produit ${product.nomProduit} n'a pas suffisamment de stock`,
          });
        }
      }

      // Mettre à jour le statut des articles et la date d'achat
      userCart.items.forEach((item) => {
        const itemToUpdate = carte.items.find(
          (i) => i.product._id.toString() === item.product._id.toString()
        );
        if (itemToUpdate) {
          item.status = "commande";
          item.purchaseDate = new Date();
          item.quantity = itemToUpdate.quantity; // Mettre à jour la quantité
        }
      });

      // Calculer le total de la carte pour tous les produits
      const total = userCart.items.reduce((acc, item) => {
        return acc + item.quantity * item.product.prix; // Assurez-vous que chaque item a un attribut 'prix'
      }, 0);

      // Mettre à jour le totalAmount de la carte
      userCart.totalAmount = total;

      // Mettre à jour la carte dans la base de données
      await userCart.save();

      // Si tous les produits ont suffisamment de stock, mettre à jour les produits
      for (const item of carte.items) {
        const product = await Produit.findById(item.product);

        // Mettre à jour le stock du produit
        product.quantite -= item.quantity;
        await product.save();
      }

      res
        .status(200)
        .json({ message: "Commande confirmée avec succès", userCart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Récupérer le panier d'un utilisateur
  getCart: async (req, res) => {
    try {
      const { idClient } = req.params;
      const cart = await Cart.findOne({ user: idClient })
        .populate("items.product")
        .exec();
      if (!cart) {
        return res
          .status(404)
          .json({ message: "Aucun panier trouvé pour cet utilisateur" });
      }
      cart.items = cart.items.filter((item) => item.status === "panier");
      console.log(cart);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Récupérer les commandes d'un utilisateur
  getOrders: async (req, res) => {
    try {
      const { idClient } = req.params;
      const cart = await Cart.findOne({ user: idClient })
        .populate("items.product")
        .exec();
      if (!cart) {
        res.status(404).json({ message: "not found" });
      } else {
        cart.items = cart.items.filter((item) => item.status === "commande");
        res.status(200).json(cart);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteOne: async (req, res) => {
    try {
      // Find the cart by ID
      const cart = await Cart.findOne({ user: req.params.idClient });

      // Filter out items with status 'panier'
      cart.items = cart.items.filter((item) => item.status !== "panier");

      // Save the updated cart
      await cart.save();

      // Respond with success message
      res
        .status(200)
        .json({ message: "Items with status 'panier' deleted successfully" });
    } catch (e) {
      // Handle errors and respond with error message
      res.status(500).json({ error: e.message });
    }
  },
};

import mongoose from 'mongoose';
import { sendConfirmationSms } from '../utils/sms.js';
import PDFDocument from 'pdfkit';
import { sendPersonalizedSms } from '../utils/sms.js';

import Client from '../models/client.js'; // Assurez-vous d'importer correctement votre modèle Client



export async function sendPersonalizedMessages(req, res) {
    try {
        const today = new Date();
        const clients = await Client.find();

        for (const client of clients) {
            const birthday = new Date(client.dateInscription);
            const isBirthday = birthday.getDate() === today.getDate() && birthday.getMonth() === today.getMonth();

            if (isBirthday) {
                const message = `Bonjour, ${client.prenom} ${client.nom}! célébrez l'anniversaire de votre inscription sur la plateforme Mliha et gagnez 100 points de fidélité ajoutés à votre compte !`;
                sendPersonalizedSms(client.telPortable, message);

                // Ajouter 100 points de fidélité
                client.pointFidelite = client.pointFidelite   + 100;
                await client.save(); // Enregistrer les modifications
            }
            // Ajouter d'autres messages personnalisés pour d'autres dates importantes si nécessaire
        }

        res.status(200).json({ message: 'Messages personnalisés envoyés avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Fonction pour ajouter un client


export async function addOnce(req, res) {
    try {
        const newClient = await Client.create(req.body);
        const messageBody = `Bonjour ${newClient.nom} ${newClient.prenom}, votre compte plateforme MLIHA tunise a été créé avec succès!`;
        await sendConfirmationSms(newClient.telPortable, messageBody);
        res.status(200).json(newClient);
    } catch (err) {
        if (err.code === 11000) { // Code d'erreur pour violation d'unicité dans MongoDB
            res.status(400).json({ error: 'La matricule fiscale doit être unique.' });
        } else if (err.errors && err.errors.matriculeFiscale) {
            res.status(400).json({ error: err.errors.matriculeFiscale.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
}
// Fonction pour obtenir un client par ID
export async function getOnce(req, res) {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour supprimer un client par ID
export async function deleteOnce(req, res) {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour mettre à jour un client par ID
export async function patchOnce(req, res) {
    try {
        const { _id, ...updateData } = req.body; // Exclure l'ID _id du corps de la requête
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getMany(req, res) {
    try {
        const client = await Client.find();
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

// Fonction pour filtrer les clients par région
export async function filterByRegion(req, res) {
    try {
        const clients = await Client.find({ region: req.params.region });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour calculer l'ancienneté des clients
export async function calculateAnciennete(req, res) {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const currentDate = new Date();
        const inscriptionDate = new Date(client.dateInscription);

        let years = currentDate.getFullYear() - inscriptionDate.getFullYear();
        let months = currentDate.getMonth() - inscriptionDate.getMonth();
        let days = currentDate.getDate() - inscriptionDate.getDate();
        let hours = currentDate.getHours() - inscriptionDate.getHours();
        let minutes = currentDate.getMinutes() - inscriptionDate.getMinutes();
        let seconds = currentDate.getSeconds() - inscriptionDate.getSeconds();

        // Ajuster les valeurs si elles sont négatives
        if (seconds < 0) {
            minutes--;
            seconds += 60;
        }
        if (minutes < 0) {
            hours--;
            minutes += 60;
        }
        if (hours < 0) {
            days--;
            hours += 24;
        }
        if (days < 0) {
            months--;
            // Obtenir le nombre de jours dans le mois précédent
            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Construire le message d'ancienneté
        const ancienneteMessage = `${years} ans, ${months} mois, ${days} jours, ${hours} heures, ${minutes} minutes, ${seconds} secondes`;

        res.status(200).json({ 
            // years, 
            // months, 
            // days, 
            // hours, 
            // minutes, 
            // seconds,
            anciennete: ancienneteMessage 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Fonction pour rechercher des clients
export async function searchClients(req, res) {
    try {
        const searchTerm = req.query.q;
        const regex = new RegExp(searchTerm, 'i'); // Crée une seule instance de RegExp

        const clients = await Client.find({
            $or: [
                { nom: regex },
                { prenom: regex },
                { email: regex },
                { region: regex },
                { adressePostal: regex },
                { telPortable: regex },
                { statutCompte: regex }
                
            ]
        });

        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Fonction pour filtrer les clients par catégorie
export async function filterByCategorieClient(req, res) {
    try {
        const categorieClientId = req.params.categorieClientId.trim();
        
        // Vérifiez si categorieClientId est un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(categorieClientId)) {
            return res.status(400).json({ error: 'Invalid categorieClientId format' });
        }

        const clients = await Client.find({ categorieClientId: categorieClientId });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Fonction pour exporter les clients en PDF
export async function exportClientsToPDF(req, res) {
    try {
        const clients = await Client.find();

        const doc = new PDFDocument();
        let filename = 'clients.pdf';
        filename = encodeURIComponent(filename);

        // Définir les en-têtes de la réponse pour le téléchargement du PDF
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Stream le PDF au client
        doc.pipe(res);

        // Ajouter un en-tête avec une couleur rouge
        doc.fontSize(25).fillColor('red').text('Liste des Clients Platforme E-MLIHA', { align: 'center' });
        doc.moveDown();

        // Ajouter du contenu au PDF
        clients.forEach(client => {
            doc.fontSize(12).fillColor('blue').text(`Nom: `, { continued: true }).fillColor('black').text(`${client.nom}`);
            doc.fontSize(12).fillColor('blue').text(`Prénom: `, { continued: true }).fillColor('black').text(`${client.prenom}`);
            doc.fontSize(12).fillColor('blue').text(`Email: `, { continued: true }).fillColor('black').text(`${client.email}`);
            doc.fontSize(12).fillColor('blue').text(`Adresse: `, { continued: true }).fillColor('black').text(`${client.addressePostal}`);
            doc.fontSize(12).fillColor('blue').text(`Téléphone Portable: `, { continued: true }).fillColor('black').text(`${client.telPortable}`);
            doc.fontSize(12).fillColor('blue').text(`Téléphone Fixe: `, { continued: true }).fillColor('black').text(`${client.telFixe}`);
            doc.fontSize(12).fillColor('blue').text(`Matricule Fiscale: `, { continued: true }).fillColor('black').text(`${client.matriculeFiscale}`);
            doc.fontSize(12).fillColor('blue').text(`Date d'Inscription: `, { continued: true }).fillColor('black').text(`${client.dateInscription.toDateString()}`);
            doc.fontSize(12).fillColor('blue').text(`Chiffre d'Affaires: `, { continued: true }).fillColor('black').text(`${client.chiffreAffaire}`);
            doc.fontSize(12).fillColor('blue').text(`Niveau de Satisfaction: `, { continued: true }).fillColor('black').text(`${client.niveauSatisfaction}`);
            doc.fontSize(12).fillColor('blue').text(`Statut du Compte: `, { continued: true }).fillColor('black').text(`${client.statutCompte}`);
            doc.fontSize(12).fillColor('blue').text(`Région: `, { continued: true }).fillColor('black').text(`${client.region}`);
            doc.fontSize(12).fillColor('blue').text(`Points de Fidélité: `, { continued: true }).fillColor('black').text(`${client.pointFidelite}`);
            doc.fontSize(12).fillColor('blue').text(`ID de la Catégorie Client: `, { continued: true }).fillColor('black').text(`${client.categorieClientId}`);
            doc.moveDown();
        });

        // Terminer l'écriture du PDF
        doc.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

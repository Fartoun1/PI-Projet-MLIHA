import categorieclient from '../models/categorieclient.js';
import Categorieclient from '../models/categorieclient.js';
import Client from '../models/client.js';

export function getAll(req, res) {
    Categorieclient
    .find({})
    
    .then(docs => {
        console.log("ibrahim")
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export function addOnce(req, res) {
    
    Categorieclient
    .create(req.body)
    .then(newCalegorieclient => {
        res.status(200).json(newCalegorieclient);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export function getOnce(req, res) {
    Categorieclient
    .findOne({_id: req.params.id })
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export async function getMany(req, res) {
    try {
        const categorieclient = await Categorieclient.find();
        if (!categorieclient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(categorieclient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

/**
 * Mettre à jour plusieurs documents
 * Remarque : renommez putOnce par putAll
 */
export function putAll(req, res) {
    Categorieclient
    .updateMany({}, )
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}


 //Mettre à jour un seul document

export async function patchOnce(req, res) {
    try {
        const { _id, ...updateData } = req.body; // Exclure l'ID _id du corps de la requête
        const updatedCategorieClient = await categorieclient.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedCategorieClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updatedCategorieClient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Supprimer un seul document
 */
export function deleteOnce(req, res) {
    Categorieclient
    .findByIdAndDelete({ _id: req.params.id })
    .then(doc => {
        Client.deleteMany({categorieClientId:doc._id})
        .then(()=>{
            res.status(200).json({ message: 'categorieClient deleted' });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}


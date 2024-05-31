import Reclamation from '../models/reclamation.js';

export function getAll(req, res) {
    Reclamation.find({})
    .select("_id idClient description")
    .exec()
    .then(descriptions => {
        res.status(200).json(descriptions);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

// add Once with image field:
export function addOnce(req, res) {

    Reclamation.create({
      idClient: req.body.idClient,
      idCategorieReclamation: req.body.idCategorieReclamation,
      title: req.body.title,
      description: req.body.description,
      dateReclamation: req.body.dateReclamation,
      priorite: req.body.priorite,
      statut_rec: req.body.statut_rec,
      image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
    })
      .then((newReclamation) => {
        res.status(200).json({
          title: req.body.title,
          description: newReclamation.description,
          dateReclamation: newReclamation.dateReclamation,
          priorite: newReclamation.priorite,
          statut_rec: newReclamation.statut_rec,
          image: newReclamation.image,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  
}


export async function getOnce(req, res) {

    try {
        const reclamation = await Reclamation.findOne({"idClient": req.params.idClient})
          .exec();
        res.status(200).json(reclamation);
      } catch (e) {
        res.status(500).json(e.message);
      }
}

export async function updateOne(req, res) {
    try {
      const reclamation = await Reclamation.findByIdAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.status(200).json({ message: "updated successfully", reclamation });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  
  export async function deleteOne(req, res) {
    try {
      const reclamation = await Reclamation.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ message: "delete successfully" });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  export async function updateField(req, res) {
    try {
      // Find the reclamation by id and update with the new data provided in req.body
      const reclamation = await Reclamation.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }  // Return the updated document
      );
  
      if (!reclamation) {
        return res.status(404).json({ message: "Reclamation not found" });
      }
  
      res.status(200).json({ message: "Updated successfully", reclamation });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  

  
  
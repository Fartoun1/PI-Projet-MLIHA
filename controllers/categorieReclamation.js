import CategorieReclamation from '../models/categorieReclamation.js';

export function getAll(req, res) {
    CategorieReclamation.find({})
    .select("_id idReclamation description")
    .exec()
    .then(categorieReclamations => {
        res.status(200).json(categorieReclamations);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

export function addOnce(req, res) {
    const categorieReclamation = new CategorieReclamation(req.body);
    categorieReclamation.save()
    .then(newCategorieReclamation => {
        res.status(201).json({
            description: newCategorieReclamation.description
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

export async function getOnce(req, res) {

    try {
        const categorieReclamation = await CategorieReclamation.findOne({"_id": req.params.id})
          .exec();
        res.status(200).json(categorieReclamation);
      } catch (e) {
        res.status(500).json(e.message);
      }
}

export async function updateOne(req, res) {
    try {
      const categorieReclamation = await CategorieReclamation.findByIdAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.status(200).json({ message: "updated successfully", categorieReclamation });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  
  export async function deleteOne(req, res) {
    try {
      const categorieReclamation = await CategorieReclamation.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ message: "delete successfully" });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  export async function updateField(req, res) {
    try {
      // Find the reclamation by id and update with the new data provided in req.body
      const categorieReclamation = await CategorieReclamation.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }  // Return the updated document
      );
  
      if (!categorieReclamation) {
        return res.status(404).json({ message: "CategorieReclamation not found" });
      }
  
      res.status(200).json({ message: "Updated successfully", categorieReclamation });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

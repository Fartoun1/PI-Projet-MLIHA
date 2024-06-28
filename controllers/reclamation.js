import Reclamation from '../models/reclamation.js';
import nodemailer from 'nodemailer';


export function getAll(req, res) {
  Reclamation.aggregate([
      {
          $addFields: {
              statut_rec_order: {
                  $cond: [
                      { $eq: ["$statut_rec", "new"] },
                      1,
                      {
                          $cond: [
                              { $eq: ["$statut_rec", "on hold"] },
                              2,
                              3
                          ]
                      }
                  ]
              },
              priorite_order: {
                  $cond: [
                      { $eq: ["$priorite", "high"] },
                      1,
                      {
                          $cond: [
                              { $eq: ["$priorite", "medium"] },
                              2,
                              3
                          ]
                      }
                  ]
              }
          }
      },
      {
          $sort: {
              statut_rec_order: 1,
              dateReclamation: -1,
              priorite_order: 1
          }
      },
      {
        $project: {
          _id: 1,
          idClient: 1,
          idCategorieReclamation: 1,
          title: 1,
          description: 1,
          priorite: 1,
          dateReclamation: 1,
          statut_rec: 1,
          satisfaction: 1,
          notes: 1,
          notification: 1,
          image: 1
      }
      }
  ])
  .exec()
  .then(reclamations => {
      res.status(200).json(reclamations);
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
      notes: req.body.notes,
      satisfaction: req.body.satisfaction,
      notification: req.body.notification,
      image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
    })
      .then((newReclamation) => {
        res.status(200).json({
          title: req.body.title,
          description: newReclamation.description,
          dateReclamation: newReclamation.dateReclamation,
          priorite: newReclamation.priorite,
          statut_rec: newReclamation.statut_rec,
          notes: req.body.notes,
          satisfaction: req.body.satisfaction,
          notification: req.body.notification,
          image: newReclamation.image,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  
}


export async function getOnce(req, res) {

    try {
        const reclamation = await Reclamation.find({"idClient": req.params.idClient})
          .exec();
        res.status(200).json(reclamation);
      } catch (e) {
        res.status(500).json(e.message);
      }
}

export async function getReclamation(req, res) {
      try {
        const reclamation = await Reclamation.findOne({"_id": req.params.id})
          .exec();
        res.status(200).json(reclamation);
      } catch (e) {
        res.status(500).json(e.message);
      }
}


// Updated updateOne function to handle file uploads and update form data
export async function updateOne(req, res) {
  try {
    const updateData = { ...req.body };
    
    // Check if a file is uploaded
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    console.log("----------", req.params.idClient);

    const reclamation = await Reclamation.findByIdAndUpdate(
      req.params.idClient,
      updateData,
      { new: true }  // Return the updated document
    );

    if (!reclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }

    res.status(200).json({ message: 'Updated successfully', reclamation });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}


/*
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
  */
  
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

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: 'ee4b7621150c83',
    pass: '2c49fd7b2d4cd7',
  }
});

export async function sendEmail(req, res) {
  try {
    const mailOptions = {
      to: req.body.email,
      from: 'op116@yahoo.fr',
      subject: 'Notification Reclamation',
      text: `You are receiving this because you (or someone else) have requested the Reclamation check your account.\n\n`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err); // Improved logging
        return res.status(500).json({ message: 'Error sending email', error: err.message });
      }
      console.log('Email sent:', info.response); // Log successful email sending
      res.status(200).json({ message: 'Recovery email sent' });
    });

  } catch (e) {
    console.error('Error in sendEmail function:', e); // Log any unexpected errors
    res.status(500).json({ message: e.message });
  }
}

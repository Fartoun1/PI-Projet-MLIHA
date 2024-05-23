import Client from '../models/client.js';


  export async function getOnce(req, res) {
    try {
      const client = await Client.findById(req.params.id)
        .exec();
      res.status(200).json(client);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  
export function getAll(req, res) {
    Client.find({})
    .select("_id nom prenom")
    .exec()
    .then(clients => {
        res.status(200).json(clients);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

export function addOnce(req, res) {
    const client = new Client(req.body);
    client.save()
    .then(newClient => {
        res.status(201).json({
            nom:        newClient.nom,
            prenom:     newClient.prenom,
            adresse:    newClient.adresse,
            tele:       newClient.tele
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
}



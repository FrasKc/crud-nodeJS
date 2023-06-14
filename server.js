const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');

// Initialisez l'application Firebase avec vos informations de configuration
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: '' // Votre URL de base de données
});

// Référence à la collection Firestore
const db = admin.database();

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Lien vers le Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importer les données du fichier CSV
app.post('/api/import-data', (req, res) => {
  const cheminFichierCSV = req.body.path;
  let isFirstLine = true;

  fs.createReadStream(cheminFichierCSV)
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
      if (isFirstLine) {
        isFirstLine = false;
        return;
      }

      const newContactRef = db.ref('contacts').push();
      newContactRef.set(data);
    })
    .on('end', () => {
      console.log('Import des données terminé.');
      res.status(200).json({ message: 'Import des données terminé.' });
    })
    .on('error', (error) => {
      console.error('Erreur lors de l\'import des données :', error);
      res.status(500).json({ error: 'Erreur lors de l\'import des données.' });
    });
});

// Lire les données
app.get('/api/contacts', (req, res) => {
  db.ref('contacts').once('value', (snapshot) => {
    const data = snapshot.val();
    res.status(200).json(data);
  })
  .catch((error) => {
    console.error('Erreur lors de la lecture des données :', error);
    res.status(500).json({ error: 'Erreur lors de la lecture des données.' });
  });
});

// Mettre à jour une donnée
app.put('/api/contacts/:id', (req, res) => {
  const id = req.params.id;
  const { fieldToUpdate, newValue } = req.body;

  const ref = db.ref(`contacts/${id}`);
  const dataToUpdate = { [fieldToUpdate]: newValue };
  
  ref.update(dataToUpdate)
    .then(() => {
      console.log('Document mis à jour avec succès.');
      res.status(200).json({ message: 'Document mis à jour avec succès.' });
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour du document :', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du document.' });
    });
});

// Supprimer une donnée
app.delete('/api/contacts/:id', (req, res) => {
  const id = req.params.id;

  const ref = db.ref(`contacts/${id}`);
  
  ref.remove()
    .then(() => {
      console.log('Donnée supprimée :', id);
      res.status(200).json({ message: 'Donnée supprimée avec succès.' });
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression du document :', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du document.' });
    });
});

// Créer une donnée
app.post('/api/contacts', (req, res) => {
  const newData = req.body;

  const ref = db.ref('contacts');
  const newChildRef = ref.push();
  
  newChildRef.set(newData)
    .then(() => {
      console.log('Document créé avec succès.');
      res.status(200).json({ message: 'Document créé avec succès.' });
    })
    .catch((error) => {
      console.error('Erreur lors de la création du document :', error);
      res.status(500).json({ error: 'Erreur lors de la création du document.' });
    });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

const admin = require("firebase-admin");
const fs = require("fs");
const readline = require("readline");
const csv = require('csv-parser');


// Initialisez l'application Firebase avec vos informations de configuration
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `` // Votre URL de base de données
});

// Référence à la collection Firestore
const db = admin.database();

// Fonction pour importer les données du fichier CSV ligne par ligne
function importerDonneesCSV(cheminFichierCSV) {
    const fichierStream = fs.createReadStream(cheminFichierCSV);
     let isFirstLine = true;

    fichierStream
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
      // Traitement des données de chaque ligne du CSV
      if (isFirstLine) {
        isFirstLine = false;
        return; // Ignorer la première ligne
      }

      // Enregistrement des données dans la base de données Firebase
      const newContactRef = db.ref('contacts').push();
      newContactRef.set(data);
    })
    .on('end', () => {
      console.log('Import des données terminé.');
    })
    .on('error', (error) => {
      console.error('Erreur lors de l\'import des données :', error);
    });
}

// Fonction pour créer les données de Firebase
const addData = (cheminFichierCSV, newData) => {
  const ref = db.ref(cheminFichierCSV);
  const newChildRef = ref.push();
  newChildRef.set(newData).then(() => { 
      console.log("Document crée avec succès.");
      menuPrincipal();
    })
    .catch((erreur) => {
      console.error("Erreur lors de la création du document :", erreur);
      menuPrincipal();
    });
};


// Fonction pour lire les données de Firestore
function lireDonnees(cheminFichierCSV) {
   return new Promise((resolve, reject) => {
    const ref = db.ref(cheminFichierCSV);
    ref.once('value', (snapshot) => {
      const data = snapshot.val();
      resolve(data);
      console.log(data);
      menuPrincipal();
    }, (error) => {
      reject(error);
      menuPrincipal();
    });
  });
}

// Fonction pour trier les données en fonction du numéro de téléphone avec le plus d'occurrences
async function trierParOccurrenceNumeroTelephone(collectionPath) {
  try {
    const snapshot = await admin.database().ref(collectionPath).once("value");
    const data = snapshot.val();

    // Compter le nombre d'occurrences de chaque numéro de téléphone
    const occurrences = {};
    for (const key in data) {
      const item = data[key];
         console.log(item.id)
      const numeroTelephone = item.tel;
   
      if (numeroTelephone in occurrences) {
        console.log('bizarre')
        occurrences[numeroTelephone]++;
      } else {
        occurrences[numeroTelephone] = 1;
        console.log('jejej')
      }
    }

    // Trier les données en fonction du nombre d'occurrences de chaque numéro de téléphone
    const sortedData = Object.keys(data).sort((a, b) => {
      const occurrenceA = occurrences[data[a].tel];
      const occurrenceB = occurrences[data[b].tel];
      return occurrenceB - occurrenceA;
    });

    // Récupérer les données triées dans l'ordre
    const sortedItems = sortedData.map((key) => data[key]);

    return sortedItems;
  } catch (error) {
    console.error("Erreur lors de la récupération et du tri des données :", error);
    throw error;
  }
}

// Fonction pour mettre à jour une donnée dans Firestore
function mettreAJourDonnee(cheminFichierCSV , id, fieldToUpdate, newValue) {
  const ref = db.ref(`${cheminFichierCSV}/${id}`);
  const dataToUpdate = { [fieldToUpdate]: newValue };
  ref.update(dataToUpdate).then(() => { 
      console.log("Document mis à jour avec succès.");
      menuPrincipal();
    })
    .catch((erreur) => {
      console.error("Erreur lors de la mise à jour du document :", erreur);
      menuPrincipal();
    });
}

// Fonction pour supprimer une donnée dans Firestore
function supprimerDonnee(cheminFichierCSV,id) {
  const ref = db.ref(cheminFichierCSV);
  const childRef = ref.child(id);
  childRef.remove().then(() => { 
      console.log('Donnée : ' + id + ' Supprimée');
      menuPrincipal();
    })
    .catch((erreur) => {
      console.error("Erreur lors de la suppression du document :", erreur);
      menuPrincipal();
    });
}

// Fonction pour afficher le menu principal et attendre l'entrée de l'utilisateur
function menuPrincipal() {
  console.log("\nMenu principal :");
  console.log("1. Importer les données du fichier CSV");
  console.log("2. Lire les données");
  console.log("3. Mettre à jour une donnée");
  console.log("4. Supprimer une donnée");
  console.log("5. Créer une donnée");
  console.log("6. ");
  console.log("7. Tri par Occurence de numéro");
  console.log("8. Quitter");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Veuillez choisir une action : ", (reponse) => {
    switch (reponse) {
      case "1":
        rl.question(
          "Veuillez saisir le chemin du fichier CSV : ",
          (cheminFichier) => {
            importerDonneesCSV(cheminFichier);
            rl.close();
          }
        );
        break;
      case "2":
        lireDonnees('contacts');
        break;
      case "3":
        rl.question(
          "Veuillez saisir l'ID du document à mettre à jour : ",
          (id) => {
            rl.question(
              "Veuillez saisir les champs à mettre à jour (au format champ:valeur) : ",
              (champs) => {
                let nomChamp;
                let valeurChamp;
                const champsArray = champs.split(",");
                champsArray.forEach((champ) => {
                  [nomChamp, valeurChamp] = champ.split(":");
                  console.log(nomChamp, valeurChamp);
                });
                mettreAJourDonnee('contacts', id, nomChamp, valeurChamp);
                rl.close();
              }
            );
          }
        );
        break;
      case "4":
        rl.question("Veuillez saisir l'ID du document à supprimer : ", (id) => {
          supprimerDonnee('contacts',id);
          rl.close();
        });
        break;
      case "5":
        rl.question("Veuillez saisir l'adresse de votre nouvelle donnée : ", (adress) => {
          rl.question("Veuillez saisir le pays de votre nouvelle donnée : ", (pays) => {
            rl.question("Veuillez saisir le departement de votre nouvelle donnée : ", (departement) => {
              rl.question("Veuillez saisir l'email de votre nouvelle donnée : ", (email) => {
                rl.question("Veuillez saisir le nom de votre nouvelle donnée : ", (name) => {
                  rl.question("Veuillez saisir l'adresse courte de votre nouvelle donnée : ", (realAdress) => {
                    rl.question("Veuillez saisir le téléphone de votre nouvelle donnée : ", (tel) => {
                      rl.question("Veuillez saisir le titre de votre nouvelle donnée : ", (title) => {
                        var Data = {
                          adress: adress,
                          country: pays,
                          departement: departement,
                          email: email,
                          name: name,
                          realAdress: realAdress,
                          tel: tel,
                          title: title
                        }
                        addData('contacts', Data)
          })
          }) 
          })
          })
          })
          })
          })
        })
        break;
        case "6":
        rl.question("Veuillez saisir l'ID du document à supprimer : ", (id) => {
          supprimerDonnee('contacts',id);
          rl.close();
        });
        break;
      case "7":
        trierParOccurrenceNumeroTelephone()
        break;
        case "8":
        rl.close();
        break;
      default:
        console.log("Action non valide. Veuillez choisir une option valide.");
        menuPrincipal();
        break;
        
    }
  });
}

// Démarrage du programme
menuPrincipal();

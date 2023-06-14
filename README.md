# Procédure d'installation

## Introduction
Pour réaliser cette procédure, il est nécessaire d'être sur MacOS. Cette procédure ne fonctionnant pas sur Windows car elle utilise HomeBrew. Il est nécessaire d'avoir installer l'OS et d'être sur la dernière version possible.

## Installation de Homebrew
Pour débuter cette procédure, il nous faut installer **HomeBrew**, Ouvrez l'application **Terminal** 

![Logo de l'application Terminal](https://help.apple.com/assets/63D8162D4F5E9E311D0CFA28/63D816334F5E9E311D0CFA30/fr_FR/d94aa1c4979b25e9ffbda97fcbae219a.png)
  
et tapez : 

```bash

/bin/bash -c  "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

```
Cette commande vous permettra d'installer l'intégralité d'**[HomeBrew](https://brew.sh/index_fr)**

  

## Installation de Node

  

1. Dans le **Terminal** tapez :

```bash

brew install node

```
L'installation de **Node.js** se lancera.

2. Pour vérifier la version de **Node.js**, saisissez :

```bash

node -v

```

*Le résultat attendu est celui-ci :*
```bash

$ node -v
v20.2.0

```
La version peut être différente.

  

3. Et pour vérifier la version de **npm**, lancez cette commande :

```bash

npm -v

```
*Le résultat attendu est celui-ci :*
```bash

$ npm -v
9.6.6

```
La version peut être différente.

  

## Installation de git

 **ATTENTION** : Il est nécessaire d'avoir un compte [Github](https://github.com/) avant de réaliser ces commandes

Toujours dans un **Terminal** tapez :

```bash

brew install git

```
Afin d'installer Git sur votre machine.

1. Collez le texte ci-dessous en indiquant l’adresse e-mail de votre compte sur **GitHub**.

```shell

$ ssh-keygen -t ed25519-sk -C "YOUR_EMAIL"

```

**Remarque :** Si la commande échoue et que l’erreur `invalid format` ou `feature not supported,` se produit, vous utilisez peut-être une clé de sécurité matérielle qui ne prend pas en charge l’algorithme Ed25519. Entrez plutôt la commande suivante.

```shell

$ ssh-keygen -t ecdsa-sk -C "your_email@example.com"

```

2. Quand vous y êtes invité, appuyez sur le bouton de votre clé de sécurité matérielle.

3. Quand vous êtes invité à entrer un fichier dans lequel enregistrer la clé, appuyez sur Entrée pour accepter l’emplacement du fichier par défaut.

```shell

> Enter a file in which to save the key (/Users/YOU/.ssh/id_ed25519_sk): [Press enter]

```

4. Quand vous êtes invité à taper une phrase secrète, appuyez sur **Entrée**.

```shell

> Enter passphrase (empty for  no  passphrase): [Type a passphrase]

> Enter same passphrase again: [Type passphrase again]

```

5. Ajoutez la clé SSH à votre compte sur GitHub. Pour plus d’informations, consultez « [Ajout d’une nouvelle clé SSH à votre compte GitHub](https://docs.github.com/fr/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) ».

  
## Creer une db sur Firebase Realtime Database

1. Aller sur https://firebase.google.com/

2. Cliquez sur "Get Started" et "Ajouter un projet" pour créer un nouveau projet

3. Donnez lui le nom que vous souhaitez et cliquer sur "Continuer", Configurez votre projet comme vous le souhaitez et cliquer sur "Créer un projet"

4. une fois sur votre projet, rendez-vous sur "Catégories de produits" --> "Créer" --> "Realtime Database" puis cliquez sur "Créer une base de données"

5. Choisissez son emplacement et selectionnez l'option "Démarrer en mode test" puis cliquez sur "Activer"

6. Dans la sidenav a gauche, cliquez sur l'engrenage se situant à coté de "Vue d'ensemble du projet" puis cliquez sur "Paramètres du projet"

7. Cliquez sur l'onglet "Compte de service". Dans l'onglet "SDK Admin Firebase" cliquez sur "Node.js" et Cliquez sur "Générer une nouvelle clé"

8. Une fois la clé téléchargée, renommez le fichier en "serviceAccountKey.json" et placez ce fichier dans la racine du projet

  

## Cloner le Repository et Utiliser le CRUD

  

1. Dans un **Terminal**, cloner le [repository](https://github.com/FrasKc/crud-nodeJS) **Github** avec cette commande en vous plaçant la où vous souhaitez que le projet se situe sur votre machine :

```bash

git clone git@github.com:FrasKc/crud-nodeJS.git

```

2. Une fois le projet cloné sur votre machine, il est nécessaire d'installer les dépendances nécessaires pour **Firebase Realtime Database** :

```bash

npm install firebase-admin fs readline csv-parser

```

3. Lancer le projet en utilisant :

```bash

node index.js

```

## Utiliser l'API

1. Mettez à jour les dépendances :

```bash

npm install firebase-admin fs readline express csv-parser joi

```

2. Lancer le projet en utilisant :

```bash

node server.js

```

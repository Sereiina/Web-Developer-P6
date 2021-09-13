# OpenClassRoom Projet 6

> Projet de formation développeur web chez OpencClassRoom :

## Contexte du projet :

Projet pour le compte de la marque de condiments à base de piments **_Piiquante_** qui veut développer une application web de critique de sauces piquantes nommée **_Hot Takes_**
Le projet utilise un front-end Javascript qui a déjà été [créé au préalable](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6)

Le projet consiste en la création de l'API pour le frontend de l'application **_Hot Takes_**

---

## Stack technique :

L'API créée a été dévelopée en Javascript avec Node en varsion `14.17.1`  
Elle utilise [MongoDB](https://www.mongodb.com) pour sa base de données  
les différents packages utilisés sont :
- bcrypt
- body-parser
- dotenv
- express
- jsonwebtoken
- mongoose
- mongoose-unique-validator
- multer

---

## Lancer le projet :

Pour lancer et démarrer le projet :

- Dans le dossier Backend :
  - copier le fichier .env.example vers .env
  - renseigner les différentes valeurs dans le fichier .env créé
  - npm install
  - nodemon server
- Dans le dossier Frontend :
  - npm install
  - npm start
  
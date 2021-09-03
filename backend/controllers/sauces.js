const Sauces = require ('../models/sauces');
const fs = require('fs');
const { log } = require('console');


exports.createSauces = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      usersLiked: 0,
      usersDisliked: 0
    });
    try {
      await sauce.save();
      res.status(201).json({ message: 'Sauce enregistré !'});
    } catch (error) {
      res.status(400).json({ error })
    }
  };
  
exports.modifySauces = async (req, res, next) => {
  const updateSauces = Sauces.updateOne(
      { _id: req.params.id}, {...req.body, _id: req.params.id }
    );
    try {
      await updateSauces;
      res.status(201).json({ message: 'Objet modifié !'});
    } catch (error) {
      res.status(400).json({ error });
    }
  };

exports.deleteSauces = async (req, res, next) => {
  let oneSauce = null;
  try {
    oneSauce = await Sauces.findOne({ _id: req.params.id });
  } catch (error) {
    res.status(500).json({ error });
  }
  const filename = oneSauce.imageUrl.split('/images/')[1];
  fs.unlink(`images/${filename}`, async () => {
    try {
      await Sauces.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Objet supprimé !'});
    } catch (error) {
      res.status(400).json({ error });
    }
  });
};

exports.getOneSauces = async (req, res, next) => {
    const OneSauce = Sauces.findOne( { _id: req.params.id})
    try { 
      sauce = await OneSauce;
      res.status(200).json(sauce);
    } catch (error) {
      res.status(404).json( { error});
    }
};

exports.getAllSauces = async (req, res, next) => {
  try {
    const allSauces = await Sauces.find()
    res.status(200).json(allSauces);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.likeSauce = (req, res, next) => {
  //const req body user+like
  // nouveau model des nouvelles valeurs 
  // method findOne
  // boucle switch (voir ci dessous)
  // uptadeOne pour enregistré les changement?

    // switch (like) {
    //   case 1:  // CAS: sauce liked
    //     newValues.usersLiked.push(userId);
    // break;
    //   case -1:  // CAS: sauce disliked
    //     newValues.usersDisliked.push(userId);
    // break;
    //   case 0:  // CAS: Annulation du like/dislike
    //     if (newValues.usersLiked.includes(userId)) {
    //     // si on annule le like
    //       const index = newValues.usersLiked.indexOf(userId);
    //       newValues.usersLiked.splice(index, 1);
    //     } else {
    //     // si on annule le dislike
    //       const index = newValues.usersDisliked.indexOf(userId);
    //       newValues.usersDisliked.splice(index, 1);
    //     }
    // break;
};
     

const Sauces = require ('../models/sauces');
const fs = require('fs');


exports.createSauces = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
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

exports.getOneSauce = async (req, res, next) => {
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

exports.likeSauce = async (req, res, next) => {

  // { userId: String, like: Number }
  if (req.body.like == 1) {
    console.log('like');
    await Sauces.findByIdAndUpdate(
      req.params.id, 
      {$addToSet: {usersLiked: req.body.userId }, {$inc: {likes: 1}}}
    );

  } else if (req.body.like == 0) {
    console.log('N/A');
  } else if (req.body.like == -1) {
    console.log('dislike');
  } else {
    console.log('400');
  }
  
res.status(200).json({message: 'test'});

};


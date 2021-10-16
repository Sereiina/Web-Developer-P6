const Sauces = require ('../models/sauces');
const fs = require('fs');
const sanitize = require('mongo-sanitize');


exports.createSauces = async ( req, res, next) => {

  const clean_sauce = sanitize(req.body.sauce);
  const sauceObject = JSON.parse(clean_sauce);

  if (req.userId !== sauceObject.userId) {
    return res.status(401).json({error: new Error('Invalid request!')});
  }

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


  const clean_sauce = sanitize(req.body.sauce);
  let sauce = null;
  
  try {
    sauce = await Sauces.findById(req.params.sauceId);
  } catch (error) {
    res.status(500).json({ error });
  }

  if (sauce == null) {
    res.status(400).json({message : "Requested sauce does not exist"});
  }
  
  if (req.userId !== sauce.userId) {
    return res.status(401).json({error: new Error('Invalid request!')});
  }

  try { 
    const sauceObject = req.file ?
    {
      ...JSON.parse(clean_sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    

    await Sauces.updateOne( { _id: req.params.sauceId}, {...sauceObject, _id: req.params.sauceId });
    res.status(201).json({ message: 'Objet modifié !'});
  } catch (error) {
    res.status(400).json({ error });
  }

};

exports.deleteSauces = async (req, res, next) => {
  let oneSauce = null;
  try {
    oneSauce = await Sauces.findById(req.params.sauceId);
  } catch (error) {
    res.status(500).json({ error });
  }
  if (oneSauce == null) {
    res.status(400).json({message : "Requested sauce does not exist"});
  }

  if (req.userId !== oneSauce.userId) {
    return res.status(401).json({error: new Error('Invalid request!')});
  }

  const filename = oneSauce.imageUrl.split('/images/')[1];
  fs.unlink(`images/${filename}`, async () => {
    try {
      await Sauces.deleteOne({ _id: req.params.sauceId });
      res.status(200).json({ message: 'Objet supprimé !'});
    } catch (error) {
      return res.status(400).json({ error });
    }
  });
};

exports.getOneSauce = async (req, res, next) => {
    const OneSauce = Sauces.findOne( { _id: req.params.sauceId})
    try { 
      sauce = await OneSauce;
      res.status(200).json(sauce);
    } catch (error) {
      res.status(404).json( { error});
    }
};

exports.getAllSauces = async (req, res, next) => {
  try {
    const allSauces = await Sauces.find();
    res.status(200).json(allSauces);
  } catch (error) {
    res.status(400).json({ error });
  }
};
 

exports.likeSauce = async (req, res, next) => {

  if (req.userId !== req.body.userId) {
    return res.status(401).json({error: new Error('Invalid request!')});
  }

  if (req.body.like == 1 || req.body.like == -1) {
    const sauce = await Sauces.findById(req.params.sauceId)
    // If the user is already in the likes or dislikes array, return a 400
    if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
      return res.status(400).json({message: 'Bad !'}); 
    }    
  }
  
  try {
    // if the user likes
    if (req.body.like == 1) {
      // add the user to the usersLiked array
      await Sauces.findByIdAndUpdate(req.params.sauceId, {$addToSet: {usersLiked: req.body.userId }});
      // add 1 to the likes
      await Sauces.findByIdAndUpdate(req.params.sauceId, {$inc: {likes: 1}});
    }
    // else, if the user dislikes
    else if (req.body.like == -1) {
      // add the user to the usersDislike array
      await Sauces.findByIdAndUpdate(req.params.sauceId, {$addToSet: {usersDisliked: req.body.userId }});
      // add 1 to the dislikes
      await Sauces.findByIdAndUpdate(req.params.sauceId, {$inc: {dislikes: 1}});
    }
    else if (req.body.like == 0) {
      // get the sauce data before the update, and remove the user from the like/dislike arrays
      const sauceData = await Sauces.findByIdAndUpdate(req.params.sauceId, {$pull: {usersLiked: req.body.userId, usersDisliked: req.body.userId}});
      // if the user removed a like, remove 1 from the likes
      if (sauceData.usersLiked.includes(req.body.userId)) {
        await Sauces.findByIdAndUpdate(req.params.sauceId, {$inc: {likes: -1}});
      }
      // if the user removed a dislike, remove 1 from the dislikes
      if (sauceData.usersDisliked.includes(req.body.userId)) {
        await Sauces.findByIdAndUpdate(req.params.sauceId, {$inc: {dislikes: -1}});
      }
    }
    // else, the value provided is wrong, return 400
    else {
      res.status(400).json({ message: 'Expected a value in the range -1, 1' });
    }
  }
  // if there's an error, return 500
  catch (error) {
    res.status(500).json({ error });
  }
  //finally, respond with 200
  res.status(200).json({message: 'OK'});

};
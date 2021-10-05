const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const fs = require('fs');
const UserModel = require ('../models/user');
const Sauces = require ('../models/sauces');




exports.signup = async (req, res, next) => {
    
    function isEmailValid(email) {
        const EmailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EmailReg.test(String(email).toLowerCase());
    };

    let hash = null;
    try {
        hash = await bcrypt.hash(req.body.password, 10)
    } catch (error) {
        return res.status(500).json({ error });
    }
    const user = new UserModel({email: req.body.email, password: hash});
    const clean_email = sanitize(req.body.email);
    const clean_password = sanitize(req.body.password);

    UserModel.findOne({email: clean_email, password: clean_password }, async function(err, doc) {
        if (isEmailValid(req.body.email)){
            await user.save();
        } else {
            return res.status(400).json("email is invalid");
        }
        res.status(201).json({ message: 'Utilisateur créé !' });    
    });
};


exports.login = async (req, res, next) => {
let user = null;
const clean_email = sanitize(req.body.email);
const clean_password = sanitize(req.body.password);
UserModel.findOne({email: clean_email, password: clean_password }, async function(err, doc) {
    try {
        user = await UserModel.findOne({ email: req.body.email })
    } catch (error) {
        return res.status(500).json({ error });
    }
    if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
     
    try {
        const valid = await bcrypt.compare(req.body.password, user.password)
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({userId: user._id, token: jwt.sign(
            {userId: user._id},
            process.env.TOKEN_SEED,
            { expiresIn: '24h'}
        )});
    } catch (error) {
        return res.status(500).json({ error });
    }
});
}

exports.profil = async (req,res,next) => {
    try {
        const profilUser = await UserModel.find({_id: req.params.id}, '-password ');
        const profilSauces = await Sauces.find({userId: req.params.id}, '-usersLiked -usersDisliked');
        const profilLikes = await Sauces.find({usersLiked: req.params.id}, '-usersLiked -usersDisliked');
        const profilDislike = await Sauces.find({usersDisliked: req.params.id}, '-usersLiked -usersDisliked');
        const response = {
            'User' : profilUser[0],
            'Sauces' : profilSauces,
            'Likes' : profilLikes,
            'Dislikes' : profilDislike
        };
        console.log(profilLikes);
        res.status(200).json(response);
    } catch(error) {
        res.status(400).json({error});
    }

}

exports.deleteProfil = async (req,res,next) => {
    
    try {
        await Sauces.updateMany({usersLiked: req.params.id}, {$inc: {likes: -1}});
        await Sauces.updateMany({usersLiked: req.params.id}, { $pull: {usersLiked: req.params.id}});
        console.log("like supp");
    } catch (error) {
        res.status(400).json({error});
    }
    
    try {
        await Sauces.updateMany({usersDisliked: req.params.id}, {$inc: {dislikes: -1}});
        await Sauces.updateMany({usersDisliked: req.params.id}, { $pull: {usersDisliked: req.params.id}});
        console.log("dislike supp");
    } catch (error) {
        res.status(400).json({error});
    }

    try {
        await Sauces.deleteOne({userId: req.params.id});
        console.log("sauces supp");
    } catch (error) {
        res.status(400).json({error});
    }

    try {
     await UserModel.deleteOne({_id: req.params.id});
     console.log("compte supp");
    } catch (error) {
     res.status(400).json({error});
    }
    res.status(200).json({message: 'informations supprimer'});
    console.log('info supp !');
}
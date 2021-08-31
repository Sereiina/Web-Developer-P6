const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken'); // quand le login / signup machera
const UserModel = require ('../models/user');


exports.signup = async (req, res, next) => {
    let hash = null;
    try {
        hash = await bcrypt.hash(req.body.password, 10)
    } catch (error) {
        return res.status(500).json({ error });
    }
    const user = new UserModel({email: req.body.email, password: hash});
    
    try {
        await user.save();
    } catch (error) {
        return res.status(400).json({ error });
    }
    
    res.status(201).json({ message: 'Utilisateur créé !' });
};


  exports.login = async (req, res, next) => {
    let user = null;

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
  }


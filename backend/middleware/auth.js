const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token){
      throw "Missing token";
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SEED);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({error: new Error('Invalid request!')});
  }
};
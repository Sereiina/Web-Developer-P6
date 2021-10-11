const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');


router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauces);
router.get('/:sauceId', auth, saucesCtrl.getOneSauce);
router.put('/:sauceId', auth, multer, saucesCtrl.modifySauces);
router.delete('/:sauceId', auth, saucesCtrl.deleteSauces);
router.post('/:sauceId/like', auth, saucesCtrl.likeSauce);

module.exports = router; 
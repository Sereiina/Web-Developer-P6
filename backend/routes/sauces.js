const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauces');

router.get('/', auth, stuffCtrl.getAllSauces);
router.post('/', auth, stuffCtrl.createSauces);
router.get('/:id', auth, stuffCtrl.getOneSauces);
router.put('/:id', auth, stuffCtrl.modifySauces);
router.delete('/:id', auth, stuffCtrl.deleteSauces);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
    createPhoto,
    getPhotos,
    getPhotoById,
    updatePhoto,
    deletePhoto
} = require('../controllers/photoController');

router.post('/', protect, createPhoto);
router.get('/', protect, getPhotos);
router.get('/:id', protect, getPhotoById);
router.put('/:id', protect, updatePhoto);
router.delete('/:id', protect, deletePhoto);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createPhoto,
  getPhotos,
  getMyPhotos,     
  getPhotoById,
  updatePhoto,
  deletePhoto,
} = require('../controllers/photoController');

router.post('/', protect, createPhoto);


router.get('/', getPhotos);


router.get('/my', protect, getMyPhotos);

router.get('/:id', getPhotoById);
router.put('/:id', protect, updatePhoto);
router.delete('/:id', protect, deletePhoto);

module.exports = router;

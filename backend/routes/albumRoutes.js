const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
    createAlbum,
    getAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum
} = require('../controllers/albumController');

router.post('/', protect, createAlbum);
router.get('/', protect, getAlbums);
router.get('/:id', protect, getAlbumById);
router.put('/:id', protect, updateAlbum);
router.delete('/:id', protect, deleteAlbum);

module.exports = router;

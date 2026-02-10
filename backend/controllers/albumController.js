const Album = require('../models/Album');

// Создать альбом
exports.createAlbum = async (req, res) => {
    try {
        const album = await Album.create({
            title: req.body.title,
            description: req.body.description,
            userId: req.user._id
        });
        res.status(201).json(album);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить все свои альбомы
exports.getAlbums = async (req, res) => {
    try {
        const albums = await Album.find({ userId: req.user._id });
        res.json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить альбом по ID
exports.getAlbumById = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: 'Альбом не найден' });
        if (album.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Нет прав доступа' });
        }
        res.json(album);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Обновить альбом
exports.updateAlbum = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: 'Альбом не найден' });
        if (album.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Нет прав доступа' });
        }
        album.title = req.body.title || album.title;
        album.description = req.body.description || album.description;
        await album.save();
        res.json(album);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Удалить альбом
exports.deleteAlbum = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: 'Альбом не найден' });
        if (album.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Нет прав доступа' });
        }
        await album.remove();
        res.json({ message: 'Альбом удалён' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Photo = require('../models/Photo');

// Создать фото
exports.createPhoto = async (req, res) => {
  try {
    const photo = await Photo.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      albumId: req.body.albumId,
      userId: req.user._id
    });
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить все фото пользователя
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user._id });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить фото по ID
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Фото не найдено' });
    if (photo.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав доступа' });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновить фото
exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Фото не найдено' });
    if (photo.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав доступа' });
    }
    photo.title = req.body.title || photo.title;
    photo.description = req.body.description || photo.description;
    photo.imageUrl = req.body.imageUrl || photo.imageUrl;
    await photo.save();
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Удалить фото
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Фото не найдено' });
    if (photo.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав доступа' });
    }

    // ВАЖНО: вместо photo.remove()
    await photo.deleteOne(); // или await Photo.findByIdAndDelete(req.params.id);

    // можно оставить 200 с сообщением
    res.status(200).json({ message: 'Фото удалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

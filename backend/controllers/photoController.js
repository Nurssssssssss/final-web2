const Photo = require('../models/Photo');


exports.createPhoto = async (req, res) => {
  try {
    const photo = await Photo.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      albumId: req.body.albumId,
      userId: req.user._id,
      username: req.user.username, 
    });

    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', 'username');
    if (!photo) return res.status(404).json({ message: 'Фото не найдено' });

    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Фото не найдено' });

    if (
      photo.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Нет прав доступа' });
    }

    
    photo.title = req.body.title !== undefined ? req.body.title : photo.title;
    photo.description =
      req.body.description !== undefined ? req.body.description : photo.description;
    photo.imageUrl =
      req.body.imageUrl !== undefined ? req.body.imageUrl : photo.imageUrl;
    photo.albumId =
      req.body.albumId !== undefined ? req.body.albumId : photo.albumId;

    await photo.save();
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Фото не найдено' });

    if (
      photo.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Нет прав доступа' });
    }

    await photo.deleteOne();
    res.status(200).json({ message: 'Фото удалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

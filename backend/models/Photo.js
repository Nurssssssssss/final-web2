const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // <-- деструктуризация

router.get('/profile', protect, (req, res) => {
    res.json({
        message: 'Профиль пользователя',
        user: req.user
    });
});

module.exports = router;

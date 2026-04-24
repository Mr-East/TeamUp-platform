const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.get('/me', authMiddleware, userController.getCurrentUser);
router.get('/talents', authMiddleware, userController.getTalents);
router.get('/:id', userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.get('/:id/posts', userController.getUserPosts);
router.post('/avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;

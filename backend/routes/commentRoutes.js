const express = require('express');
const router = express.Router();
const {
    addComment,
    getCommentsByPost,
    toggleLikeComment,
    deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addComment);
router.get('/:postId', getCommentsByPost); // Public
router.put('/:id/like', protect, toggleLikeComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;

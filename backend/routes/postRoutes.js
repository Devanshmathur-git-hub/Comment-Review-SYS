const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getPostById,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPost);
router.get('/', getPosts); // Public
router.get('/:id', getPostById); // Public

module.exports = router;



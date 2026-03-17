const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;

        const post = await Post.create({
            title,
            content,
            imageUrl,
            author: req.user._id,
        });

        const populated = await post.populate('author', 'name email avatar');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email avatar')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            'author',
            'name email avatar'
        );
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPost, getPosts, getPostById };


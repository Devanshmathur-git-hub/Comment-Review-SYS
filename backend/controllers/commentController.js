const Comment = require('../models/Comment');

// @desc    Add a comment to a post
// @route   POST /api/comments
const addComment = async (req, res) => {
    try {
        const { text, postId, parentId } = req.body;

        const comment = await Comment.create({
            text,
            author: req.user._id,
            post: postId,
            parent: parentId || null,
        });

        const populated = await comment.populate('author', 'name email avatar');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name email avatar')
            .sort({ createdAt: 1 });
        res.json(comments);        //Controller sends: dev
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike a comment
// @route   PUT /api/comments/:id/like
const toggleLikeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const userId = req.user._id;
        const alreadyLiked = comment.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike
            comment.likes = comment.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
        } else {
            // Like
            comment.likes.push(userId);
        }

        await comment.save();
        const populated = await comment.populate('author', 'name email avatar');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Only the author can delete their comment
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Also delete all child comments (replies)
        await Comment.deleteMany({ parent: req.params.id });
        await Comment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addComment, getCommentsByPost, toggleLikeComment, deleteComment };

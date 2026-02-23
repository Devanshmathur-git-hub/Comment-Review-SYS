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

// @desc    Get paginated comments for a post (10 root comments per page, with their replies)
// @route   GET /api/comments/:postId?page=1&limit=10
const getCommentsByPost = async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const postId = req.params.postId;
        const rootFilter = { post: postId, parent: { $in: [null, undefined] } };

        // Total count of root (top-level) comments only
        const totalRoots = await Comment.countDocuments(rootFilter);
        const totalPages = Math.ceil(totalRoots / limit) || 1;

        // Get this page's root comments only (10 per page)
        const rootComments = await Comment.find(rootFilter)
            .populate('author', 'name email avatar')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

        let parentIds = rootComments.map((c) => c._id);
        const allReplies = [];

        // Fetch all nested replies (replies to replies, etc.) for this page's roots
        while (parentIds.length > 0) {
            const batch = await Comment.find({ post: postId, parent: { $in: parentIds } })
                .populate('author', 'name email avatar')
                .sort({ createdAt: 1 })
                .lean();
            allReplies.push(...batch);
            parentIds = batch.map((c) => c._id);
        }

        // Combine: root comments first, then all replies (frontend builds tree from flat list)
        const comments = [...rootComments, ...allReplies];

        res.json({
            comments,
            page,
            limit,
            total: totalRoots,
            totalPages,
        });
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

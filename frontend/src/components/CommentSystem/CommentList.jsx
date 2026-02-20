
import { useState, useEffect } from 'react';
import { getComments, createComment, toggleLikeComment, getCurrentUser } from '../../services/api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import './CommentSystem.css';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = getCurrentUser();

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const data = await getComments(postId);
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleAddComment = async (text, parentId = null) => {
        try {
            const newComment = await createComment(text, postId, parentId);
            setComments((prev) => [...prev, newComment]);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert(error.message);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const updatedComment = await toggleLikeComment(commentId);
            setComments((prev) =>
                prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
            );
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const getReplies = (commentId) => {
        return comments
            .filter((c) => {
                const parentId = c.parent?._id || c.parent;
                return parentId && parentId.toString() === commentId.toString();
            })
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    const rootComments = comments
        .filter((c) => !c.parent)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (isLoading) {
        return (
            <div className="comment-list-container">
                <div className="loading-spinner">Loading comments...</div>
            </div>
        );
    }

    return (
        <div className="comment-list-container">
            <h3>Comments ({comments.length})</h3>

            {currentUser ? (
                <div className="comment-form-root">
                    <CommentForm
                        onSubmit={(text) => handleAddComment(text, null)}
                        buttonText="Post Comment"
                    />
                </div>
            ) : (
                <p className="login-prompt">Please login to post a comment.</p>
            )}

            <div className="comments-list">
                {rootComments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    rootComments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            currentUser={currentUser}
                            onAddComment={handleAddComment}
                            onLikeComment={handleLikeComment}
                            getReplies={getReplies}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentList;

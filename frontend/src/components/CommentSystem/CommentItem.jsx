
import { useState } from 'react';
import CommentForm from './CommentForm';
import { getCurrentUser } from '../../services/api';

const CommentItem = ({
    comment,
    currentUser,
    onAddComment,
    onLikeComment,
    getReplies,
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(true);

    // Author comes populated from the API
    const author = comment.author || { name: 'Unknown', avatar: '' };
    const replyComments = getReplies(comment._id);
    const hasReplies = replyComments.length > 0;
    const likeCount = comment.likes ? comment.likes.length : 0;
    const isLikedByMe =
        currentUser && comment.likes
            ? comment.likes.some(
                (id) =>
                    (typeof id === 'string' ? id : id.toString()) === currentUser._id
            )
            : false;

    const handleReplySubmit = async (text) => {
        await onAddComment(text, comment._id);
        setIsReplying(false);
        setShowReplies(true);
    };

    return (
        <div className="comment-item">
            <div className="comment-content">
                <div className="comment-header">
                    {author.avatar ? (
                        <img
                            src={author.avatar}
                            alt={author.name}
                            className="comment-avatar"
                        />
                    ) : (
                        <div className="comment-avatar-placeholder">
                            {author.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="comment-author">{author.name}</span>
                    <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                    </span>
                </div>
                <div className="comment-text">{comment.text}</div>

                <div className="comment-actions">
                    <button
                        onClick={() => onLikeComment(comment._id)}
                        className={`action-btn ${isLikedByMe ? 'liked' : ''}`}
                        disabled={!currentUser}
                    >
                        {isLikedByMe ? '❤️' : '🤍'} {likeCount}
                    </button>
                    {currentUser && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="action-btn"
                        >
                            Reply
                        </button>
                    )}
                    {hasReplies && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="action-btn toggle-replies"
                        >
                            {showReplies
                                ? 'Hide Replies'
                                : `Show ${replyComments.length} Replies`}
                        </button>
                    )}
                </div>
            </div>

            {isReplying && (
                <div className="reply-form-container">
                    <CommentForm
                        onSubmit={handleReplySubmit}
                        buttonText="Reply"
                        placeholder={`Replying to ${author.name}...`}
                    />
                </div>
            )}

            {hasReplies && showReplies && (
                <div className="comment-replies">
                    {replyComments.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            currentUser={currentUser}
                            onAddComment={onAddComment}
                            onLikeComment={onLikeComment}
                            getReplies={getReplies}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;

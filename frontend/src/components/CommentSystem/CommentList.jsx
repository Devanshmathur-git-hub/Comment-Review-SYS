
import { useState, useEffect } from 'react';
import { getComments, createComment, toggleLikeComment, getCurrentUser } from '../../services/api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import './CommentSystem.css';

const COMMENTS_PER_PAGE = 10;

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const currentUser = getCurrentUser();

    const fetchComments = async (page = 1) => {
        setIsLoading(true);
        try {
            const data = await getComments(postId, page, COMMENTS_PER_PAGE);
            const isArray = Array.isArray(data);
            const commentsList = isArray ? data : (data.comments || []);

            setComments(commentsList);
            setCurrentPage(isArray ? 1 : (data.page || 1));
            setTotalPages(isArray ? 1 : (data.totalPages || 1));
            setTotalComments(isArray ? commentsList.length : (data.total || 0));
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchComments(1);
    }, [postId]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        fetchComments(page);
        // Scroll to top of comments
        document.querySelector('.comment-list-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddComment = async (text, parentId = null) => {
        try {
            await createComment(text, postId, parentId);
            // After adding, go to the last page to see the new comment
            const newTotal = totalComments + 1;
            const lastPage = Math.ceil(newTotal / COMMENTS_PER_PAGE) || 1;
            fetchComments(lastPage);
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

    // Build pagination page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                end = Math.min(maxVisible, totalPages - 1);
            }
            if (currentPage >= totalPages - 2) {
                start = Math.max(totalPages - maxVisible + 1, 2);
            }

            if (start > 2) pages.push('...');
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push('...');

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    if (isLoading) {
        return (
            <div className="comment-list-container">
                <div className="loading-spinner">Loading comments...</div>
            </div>
        );
    }

    return (
        <div className="comment-list-container">
            <h3>Comments ({totalComments})</h3>

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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        className="pagination-btn pagination-nav"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous page"
                    >
                        ← Prev
                    </button>

                    <div className="pagination-pages">
                        {getPageNumbers().map((page, idx) =>
                            page === '...' ? (
                                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    className={`pagination-btn pagination-page ${page === currentPage ? 'pagination-active' : ''
                                        }`}
                                    onClick={() => handlePageChange(page)}
                                    aria-label={`Page ${page}`}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        className="pagination-btn pagination-nav"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Next page"
                    >
                        Next →
                    </button>
                </div>
            )}

            {totalPages > 1 && (
                <p className="pagination-info">
                    Page {currentPage} of {totalPages} · {totalComments} comments
                </p>
            )}
        </div>
    );
};

export default CommentList;

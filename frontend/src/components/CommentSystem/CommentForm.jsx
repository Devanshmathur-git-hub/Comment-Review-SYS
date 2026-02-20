
import { useState } from 'react';

const CommentForm = ({ onSubmit, initialText = '', placeholder = 'Write a comment...', buttonText = 'Post' }) => {
    const [text, setText] = useState(initialText);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(text);
            setText('');
        } catch (error) {
            console.error("Failed to submit comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                className="comment-form-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                rows={3}
            />
            <button
                type="submit"
                className="comment-form-button"
                disabled={isSubmitting || !text.trim()}
            >
                {isSubmitting ? 'Sending...' : buttonText}
            </button>
        </form>
    );
};

export default CommentForm;

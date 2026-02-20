
import CommentList from '../CommentSystem/CommentList';
import './Gallery.css';

const ImageDetail = ({ image, onClose }) => {
    return (
        <div className="image-detail-container">
            <button className="back-button" onClick={onClose}>
                ← Back to Gallery
            </button>

            <div className="detail-content">
                <div className="detail-image-section">
                    <img src={image.imageUrl} alt={image.title} className="detail-image" />
                </div>

                <div className="detail-info-section">
                    <div className="detail-header">
                        <h2>{image.title}</h2>
                        <div className="uploader-info">
                            <span>
                                By <strong>{image.author?.name}</strong>
                            </span>
                        </div>
                    </div>

                    <hr className="detail-divider" />

                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: image.content }}
                    />

                    <hr className="detail-divider" />

                    <div className="detail-comments">
                        <CommentList postId={image._id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageDetail;

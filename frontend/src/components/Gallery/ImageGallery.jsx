
import './Gallery.css';

const ImageGallery = ({ images, onSelect }) => {
    return (
        <div className="gallery-grid">
            {images.map((image) => (
                <div
                    key={image._id}
                    className="gallery-item"
                    onClick={() => onSelect(image)}
                >
                    <div className="gallery-image-wrapper">
                        <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="gallery-image"
                            loading="lazy"
                        />
                    </div>
                    <div className="gallery-info">
                        <h3 className="gallery-title">{image.title}</h3>
                        <p className="gallery-uploader">by {image.author?.name}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;

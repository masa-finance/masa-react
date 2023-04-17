import React from 'react';
export interface GalleryItemProps {
  image: string;
}
export const GalleryItem = ({ image, title, description }) => {
  return (
    <div className="gallery-item">
      <img src={image} />

      {(title || description) && (
        <div className="gallery-item-info">
          {title && <h3 className="gallery-item-title">{title}</h3>}
          {description && (
            <p className="gallery-item-description">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

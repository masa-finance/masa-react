import React from 'react';
export interface GalleryItemProps {
  image: string;
}
export const GalleryItem = ({ image, title, description }) => {
  let fixImage = image;
  console.log({image})
  if (image && image?.includes('ar://')) {
    fixImage = image.replace('ar://', 'https://arweave.net/');
  }

  return (
    <div className="gallery-item">
      <img src={fixImage} />

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

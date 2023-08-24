import React, { useMemo } from 'react';
import { GalleryMetadata } from '../../../masa';

export const GalleryItem = ({ image, name, description }: GalleryMetadata) => {

  const fixImage = useMemo(() => {
    let newImage = image;

    if (image && image?.includes('ar://')) {
      newImage = image.replace('ar://', 'https://arweave.net/');
    }
    return newImage;
  }, [image])

  return (
    <figure className="gallery-item">
      <img src={fixImage} alt={name} />

      {(name || description) && (
        <figcaption className="gallery-item-info">
          {name && <h3 className="gallery-item-title">{name}</h3>}
          {description && (
            <p className="gallery-item-description">{description}</p>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export interface GalleryMetadata {
  image?: string;
  name?: string;
  description?: string;
  tokenURI?: string;
}

export interface TabsInterface {
  items: GalleryMetadata[];
  title: string;
}

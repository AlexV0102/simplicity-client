import type { ImgHTMLAttributes } from 'react';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
}

export default function Image({ src, alt, ...props }: ImageProps) {
  return <img src={src} alt={alt} {...props} />;
}

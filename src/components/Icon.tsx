import type { ImgHTMLAttributes } from 'react';
import { icons, type IconName } from '../config/assets';
import Image from './Image';

interface IconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  name: IconName;
  alt?: string;
}

export default function Icon({ name, alt, ...props }: IconProps) {
  const iconSrc = icons[name];
  return <Image src={iconSrc} alt={alt || name} {...props} />;
}

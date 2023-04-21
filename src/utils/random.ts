import { difference } from 'lodash';
import images from '@/constants/background-images';

export const getRandomIntNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomImage = ({ excludes } = { excludes: [] as string[] }) => {
  const parts = difference(images, excludes);
  if (parts.length) {
    return parts[getRandomIntNumber(0, parts.length - 1)];
  } else {
    return images[getRandomIntNumber(0, images.length - 1)];
  }
};

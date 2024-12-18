import type { FC } from 'react';

export type SliderComponentArrow = FC<{
  hasLeft: boolean;
  hasMoreSlidesOnRight: boolean;
  handleClick: () => void;
  isLeft?: boolean;
}>;

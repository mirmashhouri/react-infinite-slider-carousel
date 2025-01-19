import type { FC } from 'react';

export type ISliderDots = FC<{
  children: React.ReactNode[];
  activeSlideIndex: number;
  hasDots: boolean;
  onDotClick: (index: number) => void;
}>;
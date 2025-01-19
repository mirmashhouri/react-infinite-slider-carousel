import { FC } from 'react';
import { AdvanceSliderStore } from './AdvanceSliderStore';
import { BaseSliderProps } from '../types';

export type SliderConfiguration = {
  infinite?: boolean;
  centerMode?: boolean;
  scaleUpOnActive?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  visibleSlidesCount?: number;
  animationDuration?: number;
  minimumSwipeDistance?: number;
  slidesToMove?: number;
  sliderWidth?: number;
  gapBetweenSlides?: number;
  slideWidth?: number;
  offset?: number;
  rtl?: boolean;
  slideClassName?: string;
  hasDots?: boolean;
  hasArrows?: boolean;
};

export type AdvancedSliderProps = BaseSliderProps & {
  config: SliderConfiguration;
};

export type AdvanceSliderComponent = FC<{
  store: AdvanceSliderStore
  slider: AdvancedSliderProps
}>;
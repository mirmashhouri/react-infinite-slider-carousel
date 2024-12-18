import type { FC, ReactNode } from 'react';

import { AdvanceSliderStore, ScrollSliderStore } from './store';
import { AdvancedSliderProps } from './AdvanceSlider';
import { ScrollSliderProps } from './ScrollSlider';

export type BaseSliderProps = {
  children: ReactNode[];
  sliderClassName?: string;
  sliderWrapperClassName?: string;
};

export type SliderProps = ScrollSliderProps | AdvancedSliderProps;

export type SliderComponent = FC<SliderProps>;

export type SliderContext = {
  store: AdvanceSliderStore;
};

export type ScrollSliderContext = {
  store: ScrollSliderStore;
};

export { AdvancedSliderProps };

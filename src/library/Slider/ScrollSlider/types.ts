import { FC, ReactNode } from 'react';
import { ScrollSliderStore } from './ScrollSliderStore';
import { BaseSliderProps } from '../types';

export type ScrollSliderProps = BaseSliderProps & {
  useScroll: true;
};

export type ScrollSliderComponent = FC<{
  children: ReactNode[]
  containerClassName?: string
  wrapperClassName?: string
  store: ScrollSliderStore
}>;
import React, { createContext, useContext, useState } from 'react';

import { AdvanceSliderStore, ScrollSliderStore } from './store';
import { AdvanceSlider } from './AdvanceSlider';
import { ScrollSlider } from './ScrollSlider';
import {
  AdvancedSliderProps,
  ScrollSliderContext,
  SliderComponent,
  SliderContext,
  SliderProps } from './types';
import './styles.css';

export const Slider: SliderComponent = (props: SliderProps) => {

  const isAdvancedSliderProps = (checkProps: SliderProps): checkProps is AdvancedSliderProps =>
    (checkProps as AdvancedSliderProps).config !== undefined;

  if (isAdvancedSliderProps(props)) {
    const context = createContext<SliderContext>({
      store: new AdvanceSliderStore(props.config),
    });

    const useSliderContext = () => useContext(context);
    const { store } = useSliderContext();
    const [stableStore] = useState(store);

    return (
      <AdvanceSlider
        store={ stableStore }
        slider={ props }
      />
    );
  } else {
    const context = createContext<ScrollSliderContext>({
      store: new ScrollSliderStore(),
    });

    const useScrollSliderContext = () => useContext(context);
    const { store } = useScrollSliderContext();
    const [stableStore] = useState(store);

    return (
      <ScrollSlider
        containerClassName={ props.sliderClassName }
        wrapperClassName={ props.sliderWrapperClassName }
        store={ stableStore }
      >
        { props.children }
      </ScrollSlider>
    );
  }
};

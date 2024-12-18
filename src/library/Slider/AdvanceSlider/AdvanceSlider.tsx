import React, { ReactElement, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import cnames from 'classnames';

import { SliderArrow } from '../SliderArrow/SliderArrow';
import { AdvanceSliderComponent } from './types';

export const AdvanceSlider: AdvanceSliderComponent = observer(({ store, slider }) => {
  const {
    activeSlideIndex,
    fakeActiveSlideIndex,
    hasMoreSlidesOnRight,
    setSliderElement,
    resetSliderParams,
    moveToNextSlide,
    initializeSlider,
  } = store;

  // Clone array if infinite scrolling is enabled
  const clonedArray = slider.config?.infinite ? [1, 2, 3] : [1];
  let itemIndexCounter = -1;

  const getKeys = () =>
    JSON.stringify(
      React.Children.toArray(slider.children).map(
        (child) => (child as ReactElement).key,
      ),
    );

  const [config, setConfig] = useState(slider.config);
  const [keys, setKeys] = useState(getKeys());

  // Update configuration when slider.config changes
  useEffect(() => {
    if (JSON.stringify(config) !== JSON.stringify(slider.config)) {
      setConfig(slider.config);
      resetSliderParams(slider.config);
    }
  }, [slider.config, config, resetSliderParams]);

  // Reinitialize actions when children keys change
  useEffect(() => {
    const newKeys = getKeys();
    if (newKeys !== keys) {
      setKeys(newKeys);
      initializeSlider();
    }
  }, [slider.children, keys, initializeSlider]);

  // Return null if there are no children
  if (slider.children.length === 0) {
    return null;
  }

  return (
    <div className={ cnames('slider', slider.sliderClassName) }>
      <div className="slider__list">
        { /* Left Arrow */ }
        <SliderArrow
          isLeft
          hasLeft={ slider.config?.infinite || activeSlideIndex > 0 }
          hasMoreSlidesOnRight
          handleClick={ () => moveToNextSlide(-1) }
        />

        { /* Right Arrow */ }
        <SliderArrow
          hasLeft
          hasMoreSlidesOnRight={ hasMoreSlidesOnRight }
          handleClick={ () => moveToNextSlide(1) }
        />

        { /* Slider Items */ }
        <div
          className={ cnames(
            'slider-wrapper',
            slider.sliderWrapperClassName,
            { infinite: slider.config?.infinite },
            { center: slider.config?.centerMode },
          ) }
          ref={ setSliderElement }
        >
          { clonedArray.map(() =>
            React.Children.map(slider.children, (child, index) => {
              itemIndexCounter++;
              return (
                <div
                  className={ cnames(
                    'slider-item',
                    slider.config.slideClassName,
                    {
                      active:
                        activeSlideIndex === itemIndexCounter ||
                        fakeActiveSlideIndex === itemIndexCounter,
                    },
                    {
                      'scale-up':
                        (activeSlideIndex === itemIndexCounter ||
                          fakeActiveSlideIndex === itemIndexCounter) &&
                        slider.config?.scaleUpOnActive,
                    },
                  ) }
                  key={ `${index.toString()}-${itemIndexCounter}` }
                  data-item="slide"
                >
                  { child }
                </div>
              );
            }),
          ) }
        </div>
      </div>
    </div>
  );
});

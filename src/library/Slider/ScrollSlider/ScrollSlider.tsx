import React, { ReactElement, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import cnames from 'classnames';

import { SliderArrow } from '../SliderArrow';
import { ScrollSliderComponent } from './types';

export const ScrollSlider: ScrollSliderComponent = observer(({
  children,
  containerClassName,
  wrapperClassName,
  store,
}) => {

  const { setSliderElement, hasLeftScroll, hasRightScroll, updateScrollVisibility, scroll, scrollToLeft } = store;
  const getKeys = () => JSON.stringify(React.Children.toArray(children).map(c => (c as ReactElement).key));
  const [keys, setKeys] = useState(getKeys());

  useEffect(() => {
    const newKeys = getKeys();
    if (newKeys !== keys) {
      scrollToLeft();
      setKeys(newKeys);
    }
  }, [children]);

  return (
    <div className={ cnames('scroll-slider') }>
      <div
        ref={ setSliderElement }
        className={ cnames('scroll-slider__container', containerClassName) }
        onMouseEnter={ () => updateScrollVisibility() }
      >
        <ul
          className={ cnames('scroll-slider__wrapper', wrapperClassName) }
        >
          <SliderArrow
            isLeft
            hasLeft={ hasLeftScroll }
            hasMoreSlidesOnRight={ hasRightScroll }
            handleClick={ () => scroll(-1) }
          />
          <SliderArrow
            hasLeft={ hasLeftScroll }
            hasMoreSlidesOnRight={ hasRightScroll }
            handleClick={ () => scroll(1) }
          />
          { children }
        </ul>
      </div>
    </div>
  );
});
import React from 'react';
import { observer } from 'mobx-react-lite';
import cnames from 'classnames';

import { ISliderDots } from './types';

export const SliderDots: ISliderDots = observer(({
  children,
  activeSlideIndex,
  hasDots,
  onDotClick,
}) => {
  if (!hasDots) return null;

  return (
    <div className="slider-dots">
      { React.Children.map(children, (_, index) => (
        <div
          key={ `${index.toString()}-dots` }
          className={ cnames('slider-dot', {
            active: activeSlideIndex % children.length === index,
          }) }
          role="button"
          onClick={ () => onDotClick(index) }
        />
      )) }
    </div>
  );
});
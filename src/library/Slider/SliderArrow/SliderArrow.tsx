import React, { memo } from 'react';

import { SliderComponentArrow } from './types';

export const SliderArrow: SliderComponentArrow = memo(({
  isLeft,
  hasLeft,
  hasMoreSlidesOnRight,
  handleClick,
}) => (
  <button
    className={ `slider__arrow ${
      isLeft ? 'slider__arrow-left' : 'slider__arrow-right'
    } ${
      isLeft && !hasLeft ? 'slider__hide' : ''
    } ${
      !isLeft && !hasMoreSlidesOnRight ? 'slider__hide' : ''
    }` }
    onClick={ handleClick }
  >
    {
      isLeft ?
        <span>⧀</span>
        : <span>⧁</span>
    }
  </button>
));

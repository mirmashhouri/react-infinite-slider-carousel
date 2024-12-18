/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Slider } from '../Slider';

describe('ScrollSlider component', () => {
  const children = [<li key={ 1 } />];
  const arrowLeft = 'slider__arrow-left';
  const arrowRight = 'slider__arrow-right';
  const containerClassName = 'test';

  const Component = (
    <Slider
      children={ children }
      sliderWrapperClassName={ containerClassName }
      useScroll={ true }
    />
  );

  it('Have containerClassName', () => {
    //Expect to render a container with containerClassName
    expect(
      render(Component).container.getElementsByClassName(containerClassName),
    ).toHaveLength(1);
  });

  it('Test hasLeft and hasMoreSlidesOnRight', () => {
    const stateMock = jest.fn();
    const useStateMock: any = (useState: any) => [useState, stateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    render(Component);

    userEvent.click(screen.getAllByRole('button')[1]);

    //Expect to test if hasLeft and hasMoreSlidesOnRight works
    expect(stateMock).toHaveBeenCalledTimes(1);
  });

  it('Render left scroll-slider arrow', () => {
    //Expect to render left arrow component
    expect(
      render(Component).container.getElementsByClassName(arrowLeft),
    ).toHaveLength(1);
  });

  it('Render right scroll-slider arrow', () => {
    //Expect to render right arrow component
    expect(
      render(Component).container.getElementsByClassName(arrowRight),
    ).toHaveLength(1);
  });

  it('Render to match snapshot', () => {
    //Expect to match snapshot
    expect(
      render(Component).container,
    ).toMatchSnapshot();
  });
});

/* eslint-disable import/no-extraneous-dependencies */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SliderArrow } from './SliderArrow';

describe('SliderArrow component', () => {
  const leftArrow = 'slider__arrow-left';
  const leftArrowIcon = 'bi-chevron-left';
  const rightArrow = 'slider__arrow-right';
  const rightArrowIcon = 'bi-chevron-right';
  const hideArrow = 'slider__hide';
  const buttonElement = 'button';

  const mockCallBack = jest.fn();

  const Component = (hasLeft: boolean, hasMoreSlidesOnRight: boolean, isLeft?: boolean ) => (
    <SliderArrow
      hasLeft={ hasLeft }
      hasMoreSlidesOnRight={ hasMoreSlidesOnRight }
      isLeft={ isLeft }
      handleClick={ mockCallBack }
    />
  );

  it('Render left arrow', () => {
    const rendered = render(Component(true, false, true));

    //Expect to render left arrow
    expect(
      rendered.container.getElementsByClassName(leftArrow),
    ).toHaveLength(1);

    //Expect to render left arrow icon
    expect(
      rendered.container.getElementsByClassName(leftArrowIcon),
    ).toHaveLength(1);
  });

  it('Render right arrow', () => {
    const rendered = render(Component(false, true));

    //Expect to render right arrow
    expect(
      rendered.container.getElementsByClassName(rightArrow),
    ).toHaveLength(1);

    //Expect to render right arrow icon
    expect(
      rendered.container.getElementsByClassName(rightArrowIcon),
    ).toHaveLength(1);
  });

  it('Test left arrow hide', () => {
    //Expect to hide left arrow
    expect(
      render(Component(false, true, true)).container.getElementsByClassName(hideArrow),
    ).toHaveLength(1);
  });

  it('Test right arrow hide', () => {
    //Expect to hide right arrow
    expect(
      render(Component(false, false, false)).container.getElementsByClassName(hideArrow),
    ).toHaveLength(1);
  });

  it('Test button and handleClick', () => {
    render(Component(false, true, true));

    userEvent.click(screen.getByRole(buttonElement));

    //Expect handleClick to work properly
    expect(mockCallBack).toBeCalledTimes(1);
  });

  it('Render to match snapshot', () => {
    //Expect to render left Arrow
    expect(
      render(Component(true, false, true)).container,
    ).toMatchSnapshot();

    //Expect to render rightArrow
    expect(
      render(Component(true, false, false)).container,
    ).toMatchSnapshot();
  });
});
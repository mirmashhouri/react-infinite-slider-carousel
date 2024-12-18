/* eslint-disable import/no-extraneous-dependencies */
import { render } from '@testing-library/react';

import { Slider } from '..';
import { SliderConfiguration } from './types';

describe('Slider component', () => {
  const sliderClassName = 'slider';
  const slideClassName = 'slider-item';
  const activeClassName = 'active';
  const scaleupClassName = 'scale-up ';
  const sliderArrowClassName = 'slider__arrow';

  const rootClassName = 'root-test';
  const wrapperClassName = 'wrapper-test';
  const itemClassName = 'item-test';

  const initialConfig: SliderConfiguration = {
    autoPlay: false,
    autoPlayInterval: 15000,
    rtl: false,
    infinite: false,
    centerMode: false,
    scaleUpOnActive: true,
    animationDuration: 500,
    minimumSwipeDistance: 100,
    visibleSlidesCount: 1,
    slidesToMove: 1,
    offset: 40,
    gapBetweenSlides: 20,
    slideClassName: itemClassName,
  };

  const childCount = [1, 2, 3];
  const children: HTMLDivElement[] = [];

  childCount.map(() => {
    const childItem = document.createElement('div');
    childItem.setAttribute('data-item', 'slide');
    children.push(
      childItem,
    );
  } );

  const Component = (config: SliderConfiguration = initialConfig) => (
    <Slider
      config={ config }
      key={ 1 }
      sliderClassName={ rootClassName }
      sliderWrapperClassName={ wrapperClassName }
    >
      { childCount.map((child) => (
        <div key={ child }>
        test
        </div>
      ) ) }
    </Slider>
  );

  it('Render Slider', () => {
    //Expect to render slider component
    expect(
      render(Component()).container.getElementsByClassName(sliderClassName),
    ).toHaveLength(1);
  });

  it('SliderItems count when is not infinite', () => {
    //Expect to SliderItems count equal children Count
    expect(
      render(Component()).container.getElementsByClassName(slideClassName),
    ).toHaveLength(childCount.length);
  });


  it('SliderItems count when is infinite', () => {
    const customConfig: SliderConfiguration = {
      infinite: true,
    };
    //Expect to SliderItems count equal children Count * 3
    expect(
      render(Component(customConfig)).container.getElementsByClassName(slideClassName),
    ).toHaveLength(childCount.length * 3);
  });

  it('active item when infinite and not in center', () => {
    const customConfig: SliderConfiguration = {
      infinite: true,
      centerMode: false,
    };
    //Expect to active item equal children Count +1
    expect(
      render(Component(customConfig)).container.getElementsByClassName(slideClassName)[childCount.length + 1],
    ).toHaveClass(activeClassName);
  });

  it('active item when infinite and in center', () => {
    const customConfig: SliderConfiguration = {
      infinite: true,
      centerMode: true,
    };
    //Expect to active item equal children Count +2
    expect(
      render(Component(customConfig)).container.getElementsByClassName(slideClassName)[childCount.length + 2],
    ).toHaveClass(activeClassName);
  });

  it('active item when is not infinite', () => {
    const customConfig: SliderConfiguration = {
      infinite: false,
    };
    //Expect to active item equal zero
    expect(
      render(Component(customConfig)).container.getElementsByClassName(slideClassName)[0],
    ).toHaveClass(activeClassName);
  });

  it('Scaleup active item ', () => {
    const customConfig: SliderConfiguration = {
      scaleUpOnActive: true,
    };
    //Expect to add Scale up calss to the active item
    expect(
      render(Component(customConfig)).container.getElementsByClassName(activeClassName)[0],
    ).toHaveClass(scaleupClassName);
  });

  it('Render Slider Arrows', () => {
    //Expect to render 2 sliderArrows
    expect(
      render(Component()).container.getElementsByClassName(sliderArrowClassName),
    ).toHaveLength(2);

  });

  it('Extra classNames', () => {

    //Expect to add rootClassName to component
    expect(
      render(Component()).container.getElementsByClassName(rootClassName),
    ).toHaveLength(1);

    //Expect to add wrapperClassName to component
    expect(
      render(Component()).container.getElementsByClassName(wrapperClassName),
    ).toHaveLength(1);

    //Expect to add rootClassName to component
    expect(
      render(Component()).container.getElementsByClassName(itemClassName),
    ).toHaveLength(childCount.length);
  });

  it('Render to match snapshot', () => {
    //Expect to match snapshot
    expect(
      render(Component()).container,
    ).toMatchSnapshot();
  });
});
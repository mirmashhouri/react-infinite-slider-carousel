/* eslint-disable import/no-extraneous-dependencies */
import { waitFor } from '@testing-library/react';
import { AdvanceSliderStore } from './AdvanceSliderStore';
import { SliderConfiguration } from './types';

describe('Infinite AdvanceSliderStore', () => {

  const config: SliderConfiguration = {
    infinite: true,
    centerMode: true,
  };


  const store = new AdvanceSliderStore(config);

  const sliderEl: HTMLDivElement = <HTMLDivElement>(document.createElement('div'));

  const childrenKey = [0, 1, 2, 3, 4, 5, 6, 7, 8];


  childrenKey.map(() => {
    const childItem = document.createElement('div');
    childItem.setAttribute('data-item', 'slide');
    sliderEl.appendChild(
      <HTMLDivElement>(childItem),
    );
  } );

  const childCount = childrenKey.length;
  store.setSliderElement(sliderEl);


  it('config slider element', () => {
    expect(store.sliderElement).toBe(sliderEl);

    //Expect to be children count/3(Real children) + 1(centerMode)+ 1(first moveToNextSlide)
    expect(store.activeSlideIndex).toBe(5);

    //Expect to be children count/3(Real children) + 1(centerMode)+ 1(first moveToNextSlide)
    expect(store.activeSlideIndex).toBe(5);
    expect(store.slideElements.length).toBe(childCount);
    expect(store.config).toStrictEqual(config);
  });

  it('config slider element', () => {

    store.isMoveLocked = false;
    store.moveToNextSlide(1);
    //Expect to Move the 6th Slide then show the 3th slide
    expect(store.activeSlideIndex).toBe(3);
    expect(store.fakeActiveSlideIndex).toBe(6);

    //Expect to Move the 4th Slide and show the 4th slide
    store.isMoveLocked = false;
    store.moveToNextSlide(1);
    expect(store.activeSlideIndex).toBe(4);
    expect(store.fakeActiveSlideIndex).toBe(4);

    //Expect to Move the 5th Slide and show the 5th slide
    store.isMoveLocked = false;
    store.moveToNextSlide(1);
    expect(store.activeSlideIndex).toBe(5);
    expect(store.fakeActiveSlideIndex).toBe(5);

    //Expect to Move the 6th Slide then show the 3th slide (Loop of Infinit)
    store.isMoveLocked = false;
    store.moveToNextSlide(1);
    expect(store.activeSlideIndex).toBe(3);
    expect(store.fakeActiveSlideIndex).toBe(6);

    //Expect to Move the 2th Slide and show the 5th slide (inverse loop of infinite)
    store.isMoveLocked = false;
    store.moveToNextSlide(-1);
    expect(store.activeSlideIndex).toBe(5);
    expect(store.fakeActiveSlideIndex).toBe(2);

    //Expect to Move double to  7th slide then show 4th slide.
    store.isMoveLocked = false;
    store.moveToNextSlide(2);
    expect(store.activeSlideIndex).toBe(4);
    expect(store.fakeActiveSlideIndex).toBe(7);

  });
});


describe('Not Infinite AdvanceSliderStore', () => {

  const config: SliderConfiguration = {
    infinite: false,
    centerMode: false,
  };


  const store = new AdvanceSliderStore(config);

  const sliderEl: HTMLDivElement = <HTMLDivElement>(document.createElement('div'));

  const childCount = [0, 1, 2];


  childCount.map(() => {
    const childItem = document.createElement('div');
    childItem.setAttribute('data-item', 'slide');
    sliderEl.appendChild(
      <HTMLDivElement>(childItem),
    );
  } );

  store.setSliderElement(sliderEl);


  it('config slider element', () => {
    expect(store.sliderElement).toBe(sliderEl);
    expect(store.activeSlideIndex).toBe(0);
    expect(store.fakeActiveSlideIndex).toBe(0);
    expect(store.slideElements.length).toBe(childCount.length);
    expect(store.config).toStrictEqual(config);
  });

  it('config slider element', () => {

    store.isMoveLocked = false;
    store.hasMoreSlidesOnRight = true;
    store.moveToNextSlide(1);
    //Expect to Move next slide
    expect(store.activeSlideIndex).toBe(1);
    expect(store.fakeActiveSlideIndex).toBe(1);

  });
});


describe('autoPlayInterval and slidesToMove', () => {

  const config: SliderConfiguration = {
    infinite: true,
    centerMode: true,
    autoPlayInterval: 1000,
    slidesToMove: 2,
  };


  const store = new AdvanceSliderStore(config);

  const sliderEl: HTMLDivElement = <HTMLDivElement>(document.createElement('div'));

  const childrenKey = [0, 1, 2, 3, 4, 5, 6, 7, 8];


  childrenKey.map(() => {
    const childItem = document.createElement('div');
    childItem.setAttribute('data-item', 'slide');
    sliderEl.appendChild(
      <HTMLDivElement>(childItem),
    );
  } );

  store.setSliderElement(sliderEl);

  it('moveToNextSlide on autoPlayInterval', () => {
    //Expect to be children count/3(Real children) + 1(centerMode)+ 2(first moveToNextSlide)
    expect(store.fakeActiveSlideIndex).toBe(6);
    expect(store.activeSlideIndex).toBe(3);

    waitFor(() => {
      //move 2 items after 1000ms
      expect(store.fakeActiveSlideIndex).toBe(7);
      expect(store.activeSlideIndex).toBe(3);
    }, { timeout: 1500 });
  });
});

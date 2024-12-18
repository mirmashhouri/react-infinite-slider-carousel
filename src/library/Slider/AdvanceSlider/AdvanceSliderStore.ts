import { SliderConfiguration } from './types';
import { makeObservable, observable, action, autorun, runInAction, IReactionDisposer } from 'mobx';
import { SliderEvents } from '../events';

export class AdvanceSliderStore {

  private isInfinite = false;

  private centerModeed = false;

  private isActiveScaleUp = false;

  private isAutoplay = false;

  private isRtl = false;

  private autoplayInterval = 5000;

  private visibleSlidesCount = 1;

  private animationDuration = 400;

  private minSwipeDistance = 50;

  private sliderContainerWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  private slideGap = 20;

  private singleSlideWidth = 0;

  private sliderOffset = ((this.sliderContainerWidth - this.singleSlideWidth) / 2);

  private totalSlidesCount = 3;

  private slidesToMove = 1;

  private initialSlideIndex = this.totalSlidesCount + 1;

  public isMoveLocked = false;

  private lastSlidePosition = { currentLeft: 0, alternateLeft: 0 };

  private readonly autoRunDisposer: IReactionDisposer;

  @observable config?: SliderConfiguration;

  @observable.ref sliderElement: HTMLElement = document.createElement('div') as HTMLElement;

  @observable.ref autoplayTimer?: NodeJS.Timer = undefined;

  @observable slideElements: HTMLDivElement[] = [];

  @observable sliderWrapperLeft: number = (-1 * this.initialSlideIndex * this.singleSlideWidth) - this.sliderOffset;

  @observable nextSlideLeft: number = this.sliderWrapperLeft;

  @observable activeSlideIndex: number = this.initialSlideIndex;

  @observable fakeActiveSlideIndex: number = this.initialSlideIndex;

  @observable touchStartX: number = 0;

  @observable isDragging: boolean = false;

  @observable hasMoreSlidesOnRight: boolean = true;

  private alternatePositionTimeout: ReturnType<typeof setTimeout> | undefined;

  @observable slideChangeEvent = new CustomEvent('activeChange', { detail: this.activeSlideIndex });

  constructor(config?: SliderConfiguration) {
    this.config = config;
    makeObservable(this);

    this.autoRunDisposer = autorun(() => {
      if (this.sliderElement && this.sliderElement.children.length > 0) {
        this.addWindowResizeListener();
        this.addTouchListeners();
      }
      runInAction(() => {
        this.initializeSlider();
      });
    });
  }

  addWindowResizeListener = () => {
    window.addEventListener('resize', this.initializeSlider);
  };

  removeWindowResizeListener = () => {
    window.removeEventListener('resize', this.dispose);
  };

  addTouchListeners = () => {
    this.sliderElement.addEventListener('touchstart', this.onSwipeStart);
    this.sliderElement.addEventListener('touchmove', this.onSwipeMove);
    this.sliderElement.addEventListener('touchend', this.onSwipeEnd);
    this.sliderElement.addEventListener('touchcancel', this.onSwipeEnd);
  };

  removeTouchListeners = () => {
    this.sliderElement.removeEventListener('touchstart', this.onSwipeStart);
    this.sliderElement.removeEventListener('touchmove', this.onSwipeMove);
    this.sliderElement.removeEventListener('touchend', this.onSwipeEnd);
    this.sliderElement.removeEventListener('touchcancel', this.onSwipeEnd);
  };

  dispose = () => {
    this.removeWindowResizeListener();
    this.removeTouchListeners();
    this.autoRunDisposer();
  };

  private computeSlideGap = () => {
    const slides = this.sliderElement.children;
    return slides.length > 1 ? ((slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left)
      - slides[0].getBoundingClientRect().width) : undefined;
  };

  private computeSlideWidth = () => {
    const slides = this.sliderElement.children;
    return slides.length > 0 ? slides[0].getBoundingClientRect().width : undefined;
  };

  private setSlideSize = () => {
    let parentOffset = this.sliderContainerWidth - (this.config?.offset || 0);
    let gapBetweenSlides = this.config?.gapBetweenSlides || 0;
    parentOffset = this.config?.visibleSlidesCount ?
      parentOffset - (gapBetweenSlides * (this.config?.visibleSlidesCount + 1)) : parentOffset;

    const slideWidth = this.config?.slideWidth ||
    (this.config?.visibleSlidesCount ? (parentOffset / this.config?.visibleSlidesCount) : 0);

    if (slideWidth > 0) {
      this.slideElements.forEach(slide => slide.style.width = `${slideWidth}px`);
    }
    this.singleSlideWidth = slideWidth;

    if (this.config?.gapBetweenSlides) {
      this.sliderElement.style.gap = `${gapBetweenSlides}px`;
    }
  };

  private computeSizes = () => {
    const parentPadding = this.sliderElement.parentElement ?
      Number(window.getComputedStyle(this.sliderElement.parentElement)
        .getPropertyValue('padding-left').replace('px', '')) : 0;
    this.sliderContainerWidth = this.config?.sliderWidth || this.sliderElement.getBoundingClientRect().width ||
      Math.max(document.documentElement.getBoundingClientRect().width || 0, window.innerWidth || 0);
    this.setSlideSize();
    this.slideGap = this.config?.gapBetweenSlides || this.computeSlideGap() || 20;
    this.singleSlideWidth = this.config?.slideWidth ||
     (this.singleSlideWidth > 0 ? this.singleSlideWidth : this.computeSlideWidth()) || 0;
    this.sliderOffset = this.centerModeed ?
      (this.sliderContainerWidth - this.singleSlideWidth) / 2 : this.config?.offset || parentPadding;
  };

  @action
    resetSliderParams = (config?: SliderConfiguration) => {
      if (config) this.config = config;

      this.isInfinite = this.config?.infinite || false;
      this.centerModeed = this.config?.centerMode || false;
      this.isActiveScaleUp = this.config?.scaleUpOnActive || false;
      this.isAutoplay = this.config?.autoPlay || false;
      this.isRtl = this.config?.rtl || false;
      this.autoplayInterval = this.config?.autoPlayInterval || 5000;
      this.visibleSlidesCount = this.config?.visibleSlidesCount || 1;
      this.animationDuration = this.config?.animationDuration || 400;
      this.minSwipeDistance = this.config?.minimumSwipeDistance || 50;

      this.computeSizes();

      this.totalSlidesCount = this.isInfinite ? this.slideElements.length / 3 : this.slideElements.length;
      this.slidesToMove = this.config?.slidesToMove ? Math.min(this.config?.slidesToMove, this.totalSlidesCount) : 1;
      this.initialSlideIndex = this.isInfinite ? this.totalSlidesCount + 1 : this.isRtl ? this.totalSlidesCount - 1 : 0;
      this.isMoveLocked = false;
      this.sliderWrapperLeft = this.isInfinite ?
        (-1 * this.initialSlideIndex * this.singleSlideWidth) -
         this.sliderOffset : (-1 * this.initialSlideIndex * this.singleSlideWidth);
      this.nextSlideLeft = this.sliderWrapperLeft;
      this.activeSlideIndex = this.initialSlideIndex;
      this.fakeActiveSlideIndex = this.initialSlideIndex;
      this.touchStartX = 0;
      this.isDragging = false;

      this.resetAutoplayInterval();

      this.moveToNextSlide(this.centerModeed ? (this.isRtl ? -1 : 1) : 0, false);
    };

  @action
    setSliderElement = (el: HTMLDivElement) => {
      if (el) {
        this.sliderElement = el;
      }
    };

  @action
    initializeSlider = () => {
      if (this.sliderElement.childElementCount > 0) {
        this.loadSlides();
        this.resetSliderParams();
      }
    };

  @action
    loadSlides = () => {
      this.slideElements = Array.from(this.sliderElement.querySelectorAll<HTMLDivElement>('[data-item="slide"]'));
    };

  @action
    computeNextSlideLeft = (slidesToMoveDirection: number) => {
      if (!this.isInfinite && !this.hasMoreSlidesOnRight && slidesToMoveDirection > 0) return this.lastSlidePosition;

      this.computeSizes();

      let newIndex = this.activeSlideIndex + slidesToMoveDirection;
      const maxSwipe = this.sliderElement.scrollWidth > this.sliderContainerWidth ?
        this.sliderElement.scrollWidth - this.sliderContainerWidth : 0;
      this.hasMoreSlidesOnRight = maxSwipe >= 1;

      if (!this.isInfinite) {
        if (newIndex >= this.totalSlidesCount - 1) {
          newIndex = this.totalSlidesCount - 1;
          this.hasMoreSlidesOnRight = false;
        } else if (newIndex < 0) {
          newIndex = 0;
        }
      }

      let altIndex = newIndex >= this.totalSlidesCount * 2 ?
        (newIndex % this.totalSlidesCount) + this.totalSlidesCount :
        newIndex <= this.totalSlidesCount - 1 ? newIndex + this.totalSlidesCount : newIndex;

      if (!this.isInfinite) {
        altIndex = newIndex;
      }

      let currentLeft = this.isInfinite ? (newIndex * (this.singleSlideWidth + this.slideGap)) - this.sliderOffset :
        (newIndex * (this.singleSlideWidth + this.slideGap)) + (newIndex > 0 ? this.sliderOffset - this.slideGap : 0);
      let alternateLeft = this.isInfinite ? (altIndex * (this.singleSlideWidth + this.slideGap)) - this.sliderOffset :
        (altIndex * (this.singleSlideWidth + this.slideGap)) + (altIndex > 0 ? this.sliderOffset - this.slideGap : 0);

      if (!this.isInfinite) {
        if (currentLeft > maxSwipe) {
          alternateLeft = currentLeft = maxSwipe;
          if (currentLeft === -this.lastSlidePosition.currentLeft) {
            altIndex = newIndex = newIndex - 1;
          }
          this.hasMoreSlidesOnRight = false;
        }
      }
      this.fakeActiveSlideIndex = newIndex;
      this.activeSlideIndex = altIndex;

      return { currentLeft: -1 * currentLeft, alternateLeft: -1 * alternateLeft };
    };

  @action
    onSwipeStart = (e: TouchEvent | MouseEvent) => {
      if (!this.isMoveLocked) {
        clearInterval(this.autoplayTimer);
        this.isDragging = true;
        const touchObject = {
          curX: 'touches' in e ? e.touches[0].pageX : e.clientX,
        };
        this.touchStartX = touchObject.curX;
      }
      e.stopPropagation();
    };

  private computeSlideScaling = () => {
    if (this.isActiveScaleUp) {
      const touchDiff = this.sliderWrapperLeft - this.lastSlidePosition.alternateLeft;
      const scale = (Math.abs(touchDiff) / this.sliderContainerWidth) / 5;
      const activeElement = this.sliderElement.getElementsByClassName('slider-item active')[0];

      if (activeElement) {
        const scaleUp = Math.min(1.05, Math.max(1, 1.1 - scale));
        const siblingScaleUp = 2.05 - scaleUp;
        (activeElement as HTMLElement).style.transform = `scale(${scaleUp.toFixed(2)})`;
        const siblingElement = touchDiff > 0 ? activeElement.previousSibling : activeElement.nextSibling;
        if (siblingElement) {
          (siblingElement as HTMLElement).style.transform = `scale(${siblingScaleUp.toFixed(2)})`;
        }
      }
    }
  };

  private removeSlideScaling = () => {
    this.slideElements.forEach(slide => {
      slide.style.transform = '';
    });
  };

  @action
    onSwipeMove = (e: TouchEvent | MouseEvent) => {
      if (!this.isMoveLocked) {
        const touchObject = {
          curX: 'touches' in e ? e.touches[0].pageX : e.clientX,
        };
        this.sliderWrapperLeft = this.nextSlideLeft + (touchObject.curX - this.touchStartX);
        this.sliderElement.style.transform = `translate3d(${this.sliderWrapperLeft}px, 0px, 0px)`;
        this.computeSlideScaling();
      }
      e.stopPropagation();
    };

  @action
    moveToNextSlide = (direction: number, animate = true) => {
      if (!this.isMoveLocked) {
        this.isMoveLocked = true;
        clearInterval(this.autoplayTimer);

        this.lastSlidePosition = this.computeNextSlideLeft(direction * this.slidesToMove);
        const animation = `all ${this.animationDuration}ms ease`;
        if (animate) this.sliderElement.style.transition = animation;
        this.sliderElement.style.transform = `translate3d(${this.lastSlidePosition.currentLeft}px, 0px, 0px)`;
        this.alternatePositionTimeout = setTimeout(() => {
          this.applyAlternatePosition(this.lastSlidePosition.alternateLeft);
          this.resetAutoplayInterval();
          this.isMoveLocked = false;
          const activeElement = this.sliderElement.getElementsByClassName('slider-item active')[0];
          SliderEvents.emit('activeChange', { activeElement });
        }, animate ? this.animationDuration : 0);

        this.nextSlideLeft = this.lastSlidePosition.alternateLeft;
      }
    };

  private applyAlternatePosition = (alternateLeft: number) => {
    this.sliderElement.style.transition = '';
    this.sliderElement.style.transform = `translate3d(${alternateLeft}px, 0px, 0px)`;
  };

  @action
    onSwipeEnd = (e: TouchEvent | MouseEvent) => {
      if (!this.isMoveLocked) {
        this.removeSlideScaling();
        const touchObject = {
          curX: 'changedTouches' in e ? e.changedTouches[0].pageX : e.clientX,
        };
        let direction = 0;

        if (Math.abs(touchObject.curX - this.touchStartX) > this.minSwipeDistance) {
          direction = touchObject.curX < this.touchStartX ? 1 : -1;
        }
        this.moveToNextSlide(direction);
        this.isDragging = false;
      }

      e.stopPropagation();
    };

  @action
    resetAutoplayInterval = () => {
      clearInterval(this.autoplayTimer);
      if (this.isAutoplay) {
        this.autoplayTimer = setInterval(() => this.moveToNextSlide(this.isRtl ? -1 : 1), this.autoplayInterval);
      }
    };
}

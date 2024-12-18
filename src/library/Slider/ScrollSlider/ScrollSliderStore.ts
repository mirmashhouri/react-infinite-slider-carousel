import { makeObservable, observable, action, autorun, IReactionDisposer } from 'mobx';
import { debounce } from 'lodash';

export class ScrollSliderStore {
  private readonly disposerAutoRunScrollSlider: IReactionDisposer;

  private readonly RESIZE_DEBOUNCE_TIME: number = 30;

  @observable.ref sliderElement: HTMLElement = document.createElement('div') as HTMLElement;

  @observable hasLeftScroll: boolean = false;

  @observable hasRightScroll: boolean = true;

  private windowWidth = window.innerWidth;

  constructor() {
    makeObservable(this);

    this.disposerAutoRunScrollSlider = autorun(() => {
      if (this.sliderElement && this.sliderElement.children.length > 0) {
        this.attachWindowListeners();
      }
    });
  }

  attachWindowListeners = () => {
    this.sliderElement.addEventListener('scroll', this.updateScrollVisibility);
    window.addEventListener('resize', this.handleResizeEvents());
  };

  detachWindowListeners = () => {
    this.sliderElement.removeEventListener('scroll', this.updateScrollVisibility);
    window.removeEventListener('resize', this.handleResizeEvents());
  };

  dispose = () => {
    this.detachWindowListeners();
    this.disposerAutoRunScrollSlider();
  };

  @action
    setSliderElement = (element: HTMLDivElement) => {
      if (element) {
        this.sliderElement = element;
        this.updateScrollVisibility();
      }
    };

  public scroll = (multiplier: number) => {
    const element = this.sliderElement;

    if (element) {
      let scrollDistance = element.clientWidth;
      const listItems = element.getElementsByTagName('li');
      if (listItems && listItems.length > 0) {
        let gap = 0;
        if (listItems.length > 1) {
          gap = listItems[1].offsetLeft - listItems[0].offsetLeft - listItems[0].clientWidth;
        }
        const firstItemWidth = listItems[0].clientWidth + gap;

        for (let i = 1; i < listItems.length; i++) {
          if (scrollDistance > firstItemWidth * (i + 0.1) && scrollDistance < firstItemWidth * (i + 1)) {
            scrollDistance = firstItemWidth * i;
            break;
          }
        }
      }

      const newScrollLeft = element.scrollLeft + (multiplier * scrollDistance);
      element.scrollLeft = newScrollLeft;
    }
  };

  public scrollToLeft = () => {
    const element = this.sliderElement;

    if (element) {
      element.scrollTo({ left: 0 });
    }
  };

  @action
    updateScrollVisibility = () => {
      const element = this.sliderElement;
      if (element) {
        const parentWidth = element.parentElement?.clientWidth || window.innerWidth;
        this.hasLeftScroll = element.scrollLeft > 0;
        this.hasRightScroll = (element.scrollWidth - (element.scrollLeft + element.clientWidth) > 1);
        if (element.scrollWidth < parentWidth) {
          this.hasRightScroll = false;
          this.hasLeftScroll = false;
        }
      }
    };

  private handleResizeEvents = () => debounce(() => {
    if (this.windowWidth !== window.innerWidth) {
      this.windowWidth = window.innerWidth;
      this.scrollToLeft();
    }
  }, this.RESIZE_DEBOUNCE_TIME);
}
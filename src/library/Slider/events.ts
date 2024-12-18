import Emittery from 'emittery';

export type SliderComponentEvents = {
  'activeChange': {
    activeElement: Element
  }

  cancel: undefined
};


export const SliderEvents = new Emittery<SliderComponentEvents>();
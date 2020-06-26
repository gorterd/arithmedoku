import * as DOMUtil from '../dom_util';
import { mountPuzzleListeners } from './puzzle_listeners';
import { mountSquareInfoListeners } from './square_info_listeners';

export const mountListeners = ctx => {
  ctx.status = {
    disableUnfocus: false
  }
  mountPuzzleListeners.call(ctx);
  mountSquareInfoListeners.call(ctx);
}

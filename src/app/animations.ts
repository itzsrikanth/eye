import { trigger, state, style, transition, animate, animation, useAnimation } from '@angular/animations';


/*--------------------
@param: startX
@param: endX
@param: time
---------------------*/
export const slideIn = trigger('slideIn', [
  state('start', style({
    left: '{{ start }}'
  }), { params: { start: '20px' } }),
  state('end', style({
    left: '{{ end }}'
  }), { params: { end: '200px' } }),
  transition('* => *', animate('{{ time }} linear'))
]);
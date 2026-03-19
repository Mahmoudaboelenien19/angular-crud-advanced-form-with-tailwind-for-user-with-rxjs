import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(
    ':enter',
    [
      style({ opacity: 0 }),
      animate('{{duration}}ms {{easing}}', style({ opacity: 1 })),
    ],
    { params: { duration: 300, easing: 'ease-in' } },
  ),
]);

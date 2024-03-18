import { Injectable } from '@angular/core';
import * as alertify  from  'alertifyjs';
//declare var alertify: any;
@Injectable({ providedIn: 'root' })
export class NotifyService {


  constructor() {

  }
  error(msg: string) {
    alertify.set('notifier', 'delay', 5);
    alertify.set('notifier', 'position', 'bottom-right');
    alertify.error(msg);
  }
  success(msg: string) {
    alertify.set('notifier', 'delay', 5);
    alertify.set('notifier', 'position', 'bottom-right');
   alertify.success(msg);
  }
  message(msg: string) {
    alertify.set('notifier', 'delay', 5);
    alertify.set('notifier', 'position', 'bottom-right');
  alertify.message(msg);
  }
  warning(msg: string) {
    alertify.set('notifier', 'delay', 5);
    alertify.set('notifier', 'position', 'bottom-right');
    alertify.warning(msg);
  }
}

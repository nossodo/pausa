import {Pipe} from '@angular/core';

@Pipe({
  name: 'timer'
})
export class Timer {
  transform(value, args) {
    if (value < 10) {
      return '0' + value;
    }
    else {
      return value;
    }
  }
}

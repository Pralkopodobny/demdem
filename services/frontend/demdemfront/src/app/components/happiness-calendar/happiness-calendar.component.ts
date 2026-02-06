import {Component, signal} from '@angular/core';
import {HappinessCalendarCell} from '../happiness-calendar-cell/happiness-calendar-cell';
import {Happiness} from '../../model/Happiness';
import {Day} from '../../model/Day';
import {HappinessCalendarMonth} from '../happiness-calendar-month/happiness-calendar-month';

@Component({
  selector: 'app-happiness-calendar',
  imports: [
    HappinessCalendarCell,
    HappinessCalendarMonth
  ],
  templateUrl: './happiness-calendar.component.html',
  styleUrl: './happiness-calendar.component.css',
})
export class HappinessCalendar {
  protected readonly Happiness = Happiness;
  yearData: Day[] = randomYear()

  tempMonth = signal(1);
  tempYear = signal(2026);

  increment() {
    if(this.tempMonth() === 12) {
      this.tempMonth.set(1);
      this.tempYear.update(cur => cur + 1)
    }
    else {
      this.tempMonth.update(cur => cur + 1);
    }

  }
}


function randomYear(): Day[]  {
  return Array.from(Array(365).keys()).map(d => {return {happiness: getRandomHappiness(), day: d}})
}

function getRandomHappiness() : Happiness {
  let x = Math.random()
  if (x < 0.1){
    return Happiness.unset
  }
  if (x < 0.2) {
    return Happiness.bad
  }
  if (x < 0.5) {
    return Happiness.mid
  }
  return Happiness.good
}

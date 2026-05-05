import {Component, computed, effect, input, signal} from '@angular/core';
import {HappinessCalendarCell} from '../happiness-calendar-cell/happiness-calendar-cell';
import {Day} from '../../model/Day';
import {Happiness} from '../../model/Happiness';
import dayjs, {Dayjs} from 'dayjs';

@Component({
  selector: 'app-happiness-calendar-month',
  imports: [
    HappinessCalendarCell
  ],
  templateUrl: './happiness-calendar-month.html',
  styleUrl: './happiness-calendar-month.css',
})
export class HappinessCalendarMonth {
  month = input.required<number>();
  year = input.required<number>();

  monthData = signal<Day[]>([]);

  constructor() {
    effect(() => {
      this.monthData.set(randomMonth(this.month(), this.year()));
    });
  }

  onMoodSelected(day: Day, happiness: Happiness) {
    this.monthData.update(days => days.map(d =>
      d.date.isSame(day.date, 'day') ? {...d, happiness} : d
    ));
  }
}

function startSpan(firstDate : Dayjs) : Dayjs {
  return firstDate.subtract((firstDate.day() + 6) % 7, 'day')
}

function endSpan(firstDate : Dayjs) : Dayjs {
  const lastDay = firstDate.add(1, 'month').subtract(1, 'day');
  return lastDay.add((8 - lastDay.day()) % 7, 'day')
}

function randomMonth(month: number, year: number): Day[]  {
  const days = [];

  const monthJs = dayjs().month(month - 1).year(year).date(1)

  let act = startSpan(monthJs)
  const last = endSpan(monthJs)
  
  while (act.date() !== last.date() || act.month() !== last.month()) {
    days.push({
      happiness: getRandomHappiness(),
      date: act
    })
    act = act.add(1, 'day')
  }

  return days;
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

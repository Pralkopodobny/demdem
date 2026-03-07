import {Component, computed, input} from '@angular/core';
import {HappinessCalendarCell} from '../happiness-calendar-cell/happiness-calendar-cell';
import {Day} from '../../model/Day';
import {Happiness} from '../../model/Happiness';

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

  monthData = computed(() => randomMonth(this.month(), this.year()))
}

function firstElem(firstWeekdayOfMonth: number): number {
  switch (firstWeekdayOfMonth) {
    case 1: return 1 // Monday
    case 2: return 0 // Tuesday
    case 3: return -1 // Wednesday
    case 4: return -2 // Thursday
    case 5: return -3 // Friday
    case 6: return -4 // Saturday
    case 0: return -5 // Sunday
    default: throw 'Invalid day'
  }
}

function monthToMonthIndex(month: number): number {
  const indexCandidate = month - 1;
  return indexCandidate < 0 ? 11 : indexCandidate;
}

function randomMonth(month: number, year: number): Day[]  {
  const days = [];
  const lastDayOfMonth = new Date(year, monthToMonthIndex(month), 0)
  const firstDayOfMonth = new Date(year, monthToMonthIndex(month), 1)
  const numberOfDays = lastDayOfMonth.getDate()
  const first = firstElem(firstDayOfMonth.getDay())
  console.log(`${month}.${year} -- ${lastDayOfMonth}`)
  console.log(`${month}.${year} -- ${firstDayOfMonth}`)
  console.log(first)

  for (let day = first; day <= numberOfDays; day++) {
    days.push({
      happiness: day <= 0 ? Happiness.unset : getRandomHappiness(),
      day: day,
      month: month,
      year: year,
    })
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

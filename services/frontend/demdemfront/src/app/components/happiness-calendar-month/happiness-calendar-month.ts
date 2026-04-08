import {Component, computed, input} from '@angular/core';
import {HappinessCalendarCell} from '../happiness-calendar-cell/happiness-calendar-cell';
import {Day} from '../../model/Day';
import {Happiness} from '../../model/Happiness';
import dayjs from 'dayjs';

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

function offset(firstWeekdayOfMonth: number): number {
  return (firstWeekdayOfMonth + 6) % 7
}

function monthToMonthIndex(month: number): number {
  const indexCandidate = month - 1;
  return indexCandidate < 0 ? 11 : indexCandidate;
}

function randomMonth(month: number, year: number): Day[]  {
  const days = [];

  const monthJs = dayjs().month(month - 1).year(year).date(1)
  const numberOfDays = monthJs.daysInMonth()
  const firstDay = monthJs.day();
  const first = 1 - offset(firstDay)

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

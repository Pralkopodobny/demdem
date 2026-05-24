import {Component, signal} from '@angular/core';
import {HappinessCalendarMonth} from '../happiness-calendar-month/happiness-calendar-month';
import dayjs from 'dayjs';

@Component({
  selector: 'app-happiness-calendar',
  imports: [
    HappinessCalendarMonth
  ],
  templateUrl: './happiness-calendar.component.html',
  styleUrl: './happiness-calendar.component.css',
})
export class HappinessCalendar {
  viewDate = signal(dayjs().utc().startOf('month'));

  increment() {
    this.viewDate.update(d => d.add(1, 'month'))
  }

  decrement() {
    this.viewDate.update(d => d.subtract(1, 'month'))
  }
}

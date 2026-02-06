import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-happiness-calendar-month',
  imports: [],
  templateUrl: './happiness-calendar-month.html',
  styleUrl: './happiness-calendar-month.css',
})
export class HappinessCalendarMonth {
  month = input.required<number>();
  year = input.required<number>();
  numberOfDays = computed(() => new Date(this.year(), this.month(), 0).getDate())
}

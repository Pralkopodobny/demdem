import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {HappinessCalendarCell} from '../happiness-calendar-cell/happiness-calendar-cell';
import {Day} from '../../model/Day';
import {Happiness} from '../../model/Happiness';
import dayjs, {Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {MoodDataService, ProcessedMoodEntry} from '../../api/mood-data.service';

dayjs.extend(utc);

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
  
  private moodService = inject(MoodDataService);

  constructor() {
    effect(() => {
      const m = this.month();
      const y = this.year();
      const monthJs = dayjs.utc().month(m - 1).year(y).date(1).startOf('day');
      const start = startSpan(monthJs);
      const end = endSpan(monthJs);

      this.moodService.getMoodsRange(start, end).subscribe(entries => {
        this.monthData.set(this.generateMonthData(m, y, entries));
      });
    });
  }

  onMoodSelected(day: Day, happiness: Happiness) {
    // 1. Optimistically update UI
    this.monthData.update(days => days.map(d =>
      d.date.isSame(day.date, 'day') ? {...d, happiness} : d
    ));

    // 2. Persist to backend
    this.moodService.saveMood(day.date, happiness).subscribe({
      error: (err) => {
        console.error('Failed to save mood', err);
        // TODO: Rollback UI on error if needed
      }
    });
  }

  private generateMonthData(month: number, year: number, entries: ProcessedMoodEntry[]): Day[] {
    const days: Day[] = [];
    const monthJs = dayjs.utc().month(month - 1).year(year).date(1).startOf('day');

    let act = startSpan(monthJs);
    const last = endSpan(monthJs);

    while (!act.isSame(last, 'day')) {
      // Find if we have a mood for this date in the backend data
      const entry = entries.find(e => e.date.isSame(act, 'day'));
      
      days.push({
        happiness: entry ? entry.happiness : Happiness.unset,
        date: act
      });
      act = act.add(1, 'day');
    }

    return days;
  }
}

function startSpan(firstDate : Dayjs) : Dayjs {
  return firstDate.subtract((firstDate.day() + 6) % 7, 'day').startOf('day');
}

function endSpan(firstDate : Dayjs) : Dayjs {
  const lastDay = firstDate.add(1, 'month').subtract(1, 'day');
  return lastDay.add((8 - lastDay.day()) % 7, 'day').startOf('day');
}

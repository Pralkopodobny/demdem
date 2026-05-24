import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
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
  viewDate = input.required<Dayjs>();

  monthData = signal<Day[]>([]);

  monthName = computed(() => this.viewDate().format('MMMM YYYY'));

  private moodService = inject(MoodDataService);

  onPrevious = output<void>()
  onNext = output<void>()

  constructor() {
    effect(() => {
      const date = this.viewDate().date(1).startOf('day');
      const start = startSpan(date);
      const end = endSpan(date);

      this.moodService.getMoodsRange(start, end).subscribe(entries => {
        this.monthData.set(this.generateMonthData(date, entries));
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

  private generateMonthData(monthJs: dayjs.Dayjs, entries: ProcessedMoodEntry[]): Day[] {
    const days: Day[] = [];

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

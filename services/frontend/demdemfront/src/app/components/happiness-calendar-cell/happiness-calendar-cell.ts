import {Component, computed, input, output, signal} from '@angular/core';
import {Happiness} from '../../model/Happiness';
import {Day} from '../../model/Day';
import {HEART_SHAPE} from '../../constants/icons';

@Component({
  selector: 'app-happiness-calendar-cell',
  imports: [],
  templateUrl: './happiness-calendar-cell.html',
  styleUrl: './happiness-calendar-cell.css',
  standalone: true
})
export class HappinessCalendarCell {
  day = input.required<Day>()
  active = input.required<boolean>()
  moodSelected = output<Happiness>()

  isPicking = signal(false);

  alignmentClass = computed(() => {
    const dayOfWeek = this.day().date.day();
    if (dayOfWeek === 1) return 'left-0'; // Monday
    if (dayOfWeek === 0) return 'right-0'; // Sunday
    return 'left-1/2 -translate-x-1/2';
  });

  protected readonly Happiness = Happiness;
  protected readonly HEART_SHAPE = HEART_SHAPE;

  togglePicking() {
    if (!this.active()) return;

    this.isPicking.update(v => !v);
  }

  selectMood(mood: Happiness) {
    this.isPicking.set(false);
    this.moodSelected.emit(mood);
  }
}

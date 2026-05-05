import {Component, computed, input, output, signal} from '@angular/core';
import {Happiness} from '../../model/Happiness';
import {Day} from '../../model/Day';

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

  protected readonly Happiness = Happiness;

  togglePicking() {
    if (!this.active()) return;

    this.isPicking.update(v => !v);
  }

  selectMood(mood: Happiness) {
    this.isPicking.set(false);
    this.moodSelected.emit(mood);
  }
}

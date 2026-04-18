import {Component, computed, input, signal} from '@angular/core';
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

  protected readonly Happiness = Happiness;

  classColor = computed(() => {

    const colors = {
      [Happiness.unset]: 'bg-yellow-300',
      [Happiness.bad]: 'bg-red-400',
      [Happiness.mid]: 'bg-yellow-300',
      [Happiness.good]: 'bg-green-500',
    };

    return colors[this.day().happiness];
  });

  getFillPercentage(): number {
    const fill = {
      [Happiness.unset]: 0,
      [Happiness.bad]: 0,
      [Happiness.mid]: 50,
      [Happiness.good]: 100,
    };
    return fill[this.day().happiness];
  }
}

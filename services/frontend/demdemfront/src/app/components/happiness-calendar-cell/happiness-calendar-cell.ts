import {Component, input, signal} from '@angular/core';
import {Happiness} from '../../model/Happiness';

@Component({
  selector: 'app-happiness-calendar-cell',
  imports: [],
  templateUrl: './happiness-calendar-cell.html',
  styleUrl: './happiness-calendar-cell.css',
  standalone: true
})
export class HappinessCalendarCell {
  happiness = input<Happiness>(Happiness.unset);
  day = input.required<number>();

  protected readonly Happiness = Happiness;
}

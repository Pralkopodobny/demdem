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
  active = input.required<boolean>()

  protected readonly Happiness = Happiness;


}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappinessCalendarCell } from './happiness-calendar-cell';
import {Happiness} from '../../model/Happiness';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

describe('HappinessCalendarCell', () => {
  let component: HappinessCalendarCell;
  let fixture: ComponentFixture<HappinessCalendarCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappinessCalendarCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappinessCalendarCell);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('day', { happiness: Happiness.mid, date: dayjs.utc() });
    fixture.componentRef.setInput('active', true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open picker when clicked', () => {
    const cellElement = fixture.nativeElement.querySelector('.cursor-pointer');
    cellElement.click();
    fixture.detectChanges();
    expect(component.isPicking()).toBe(true);
    const picker = fixture.nativeElement.querySelector('.absolute.z-20');
    expect(picker).toBeTruthy();
  });

  it('should emit moodSelected when a mood is selected', () => {
    component.isPicking.set(true);
    fixture.detectChanges();

    let selectedMood: Happiness | undefined;
    component.moodSelected.subscribe(mood => selectedMood = mood);

    const badMoodButton = fixture.nativeElement.querySelectorAll('button')[0]; // Bad is 😞
    badMoodButton.click();

    expect(selectedMood).toBe(Happiness.bad);
    expect(component.isPicking()).toBe(false);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappinessCalendarMonth } from './happiness-calendar-month';

describe('HappinessCalendarMonth', () => {
  let component: HappinessCalendarMonth;
  let fixture: ComponentFixture<HappinessCalendarMonth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappinessCalendarMonth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappinessCalendarMonth);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('month', 5);
    fixture.componentRef.setInput('year', 2026);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update happiness of a day', () => {
    const day = component.monthData()[0];
    const newHappiness = (day.happiness + 1) % 4;
    component.onMoodSelected(day, newHappiness);
    
    expect(component.monthData()[0].happiness).toBe(newHappiness);
  });
});

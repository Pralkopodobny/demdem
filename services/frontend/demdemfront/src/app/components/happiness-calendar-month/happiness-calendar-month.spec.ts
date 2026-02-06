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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

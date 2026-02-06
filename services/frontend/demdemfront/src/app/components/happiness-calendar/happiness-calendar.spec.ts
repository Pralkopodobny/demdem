import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappinessCalendar } from './happiness-calendar.component';

describe('HappynessCalendar', () => {
  let component: HappinessCalendar;
  let fixture: ComponentFixture<HappinessCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappinessCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappinessCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

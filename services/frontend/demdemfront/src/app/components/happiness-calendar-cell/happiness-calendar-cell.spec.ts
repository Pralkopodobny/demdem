import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappinessCalendarCell } from './happiness-calendar-cell';

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Routes } from '@angular/router';
import {HappinessCalendar} from './components/happiness-calendar/happiness-calendar.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
  },
  {
    path: 'calendar',
    component: HappinessCalendar
  }

];

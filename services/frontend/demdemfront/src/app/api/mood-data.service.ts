import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Happiness } from '../model/Happiness';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface MoodEntry {
  id: string;
  timestamp: string;
  moodlevel: 'bad' | 'mid' | 'good' | 'unset';
}

export interface ProcessedMoodEntry extends Omit<MoodEntry, 'timestamp' | 'moodlevel'> {
  date: Dayjs;
  happiness: Happiness;
}

@Injectable({
  providedIn: 'root'
})
export class MoodDataService {
  private readonly apiUrl = '/api/moods';

  constructor(private http: HttpClient) {}

  /**
   * Fetches mood entries and converts timestamps to UTC Dayjs objects.
   */
  getMoods(): Observable<ProcessedMoodEntry[]> {
    return this.http.get<MoodEntry[]>(this.apiUrl).pipe(
      map(entries => entries.map(entry => ({
        id: entry.id,
        date: dayjs.utc(entry.timestamp),
        happiness: this.mapMoodLevelToHappiness(entry.moodlevel)
      })))
    );
  }

  /**
   * Helper to map backend moodlevel string to Happiness enum.
   */
  mapMoodLevelToHappiness(level: string): Happiness {
    switch (level) {
      case 'bad': return Happiness.bad;
      case 'mid': return Happiness.mid;
      case 'good': return Happiness.good;
      default: return Happiness.unset;
    }
  }

  /**
   * Updates or creates a mood entry.
   */
  saveMood(date: Dayjs, happiness: Happiness): Observable<any> {
    const moodlevel = this.mapHappinessToMoodLevel(happiness);
    const body = {
      timestamp: date.utc().format(),
      moodlevel
    };
    return this.http.post(this.apiUrl, body);
  }

  private mapHappinessToMoodLevel(happiness: Happiness): string {
    switch (happiness) {
      case Happiness.bad: return 'bad';
      case Happiness.mid: return 'mid';
      case Happiness.good: return 'good';
      default: return 'unset';
    }
  }
}



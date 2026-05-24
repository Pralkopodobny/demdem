import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Happiness } from '../model/Happiness';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface MoodEntry {
  id: string;
  day: string;
  moodlevel: 'bad' | 'mid' | 'good' | 'unset';
}

export interface ProcessedMoodEntry extends Omit<MoodEntry, 'day' | 'moodlevel'> {
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
   * Fetches mood entries and converts date strings to UTC Dayjs objects.
   */
  getMoods(): Observable<ProcessedMoodEntry[]> {
    return this.http.get<MoodEntry[]>(this.apiUrl).pipe(
      map(entries => entries.map(entry => ({
        id: entry.id,
        date: dayjs.utc(entry.day),
        happiness: this.mapMoodLevelToHappiness(entry.moodlevel)
      })))
    );
  }

  /**
   * Fetches mood entries for a specific range.
   */
  getMoodsRange(from: Dayjs, to: Dayjs): Observable<ProcessedMoodEntry[]> {
    const params = {
      from: from.format('YYYY-MM-DD'),
      to: to.format('YYYY-MM-DD')
    };
    return this.http.get<MoodEntry[]>(`${this.apiUrl}/range`, { params }).pipe(
      map(entries => entries.map(entry => ({
        id: entry.id,
        date: dayjs.utc(entry.day),
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
   * Updates or creates a mood entry using PUT.
   * If happiness is unset, it deletes the entry.
   */
  saveMood(date: Dayjs, happiness: Happiness): Observable<any> {
    if (happiness === Happiness.unset) {
      return this.deleteMood(date);
    }

    const moodlevel = this.mapHappinessToMoodLevel(happiness);
    const body = {
      day: date.format('YYYY-MM-DD'),
      moodlevel
    };
    return this.http.put(this.apiUrl, body);
  }

  /**
   * Deletes a mood entry for a specific date.
   */
  deleteMood(date: Dayjs): Observable<any> {
    const day = date.format('YYYY-MM-DD');
    return this.http.delete(`${this.apiUrl}/day/${day}`);
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



import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefaultService } from './api';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  client = inject(DefaultService);
  protected readonly moo = toSignal(this.client.getMood(), { initialValue: [] });
  protected readonly title = signal('demdemfront');
}

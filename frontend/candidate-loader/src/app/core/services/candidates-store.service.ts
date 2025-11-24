import { inject, Injectable, PLATFORM_ID, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Candidate } from '../models/candidate.model';

const STORAGE_KEY = 'candidate-loader:list';

@Injectable({ providedIn: 'root' })
export class CandidatesStoreService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageSupported = isPlatformBrowser(this.platformId);

  private readonly state = signal<Candidate[]>(this.restore());

  readonly candidates = this.state.asReadonly();
  readonly total = computed(() => this.state().length);

  private readonly persistEffect = effect(() => {
    if (!this.storageSupported) {
      return;
    }
    const snapshot = JSON.stringify(this.state());
    localStorage.setItem(STORAGE_KEY, snapshot);
  });

  add(candidate: Candidate): void {
    this.state.update((list) => [...list, candidate]);
  }

  replaceAll(candidates: Candidate[]): void {
    this.state.set([...candidates]);
  }

  clear(): void {
    this.state.set([]);
    if (this.storageSupported) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private restore(): Candidate[] {
    if (!this.storageSupported) {
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn('No se pudo restaurar el estado de candidatos', error);
    }
    return [];
  }
}

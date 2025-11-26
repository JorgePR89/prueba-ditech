import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Candidate } from '../models/candidate.model';

@Injectable({ providedIn: 'root' })
export class CandidatesApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  uploadCandidate(payload: {
    name: string;
    surname: string;
    file: File;
  }): Observable<Candidate> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('surname', payload.surname);
    formData.append('file', payload.file);
    return this.http.post<Candidate>(`${this.baseUrl}/candidates`, formData);
  }
}

export type CandidateSeniority = 'junior' | 'senior';

export interface CandidateForm {
  name: string;
  surname: string;
  file: File | null;
}

export interface CandidateExcelRow {
  seniority: CandidateSeniority;
  years: number;
  availability: boolean;
}

export interface Candidate extends CandidateExcelRow {
  name: string;
  surname: string;
}

export interface CandidateResponse {
  candidate: Candidate;
  processedAt: string;
}

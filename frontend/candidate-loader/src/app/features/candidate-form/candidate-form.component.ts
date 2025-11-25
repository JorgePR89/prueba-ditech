import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import {
  Candidate,
  CandidatesApiService,
  CandidatesStoreService,
} from '@app/core';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateFormComponent {
  @ViewChild('htmlForm') htmlForm!: ElementRef<HTMLFormElement>;
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private store = inject(CandidatesStoreService);
  private api = inject(CandidatesApiService);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
  });

  fileSignal = signal<File | null>(null);
  loading = signal(false);

  totalCandidates = this.store.total;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileSignal.set(input.files?.[0] ?? null);
  }

  canSubmit(): boolean {
    return this.form.valid && !!this.fileSignal() && !this.loading();
  }

  resetForm(): void {
    if (this.htmlForm) {
      this.htmlForm.nativeElement.reset();
    }
  }

  submit(): void {
    if (!this.canSubmit()) {
      return;
    }

    const { name, surname } = this.form.getRawValue();
    const file = this.fileSignal();
    if (!file) {
      return;
    }

    this.loading.set(true);
    this.api
      .uploadCandidate({ name, surname, file })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (candidate: Candidate) => {
          this.store.add(candidate);
          this.resetForm();
          this.snackBar.open('Candidato registrado.', 'Cerrar', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open('No se pudo registrar el candidato.', 'Cerrar', {
            duration: 3500,
          });
        },
      });
  }
}

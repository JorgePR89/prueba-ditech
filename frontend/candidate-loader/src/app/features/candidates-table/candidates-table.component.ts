import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CandidatesStoreService } from '@app/core';

@Component({
  selector: 'app-candidates-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule],
  templateUrl: './candidates-table.component.html',
  styleUrls: ['./candidates-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidatesTableComponent {
  private store = inject(CandidatesStoreService);

  displayedColumns = ['name', 'surname', 'seniority', 'years', 'availability'];
  data = this.store.candidates;

  clear(): void {
    this.store.clear();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';
import * as fromTraining from '../training.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  // @Output() trainingExit = new EventEmitter();
  progress = 0;
  timer: number | any;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
  ) { }

  ngOnInit(): void {
    this.startOrResumeTimer()
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      // const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
      const step = ex.duration / 100 * 1000;
      this.timer = setInterval(() => {
        this.progress += 1;
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.trainingExit.emit();
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    })
  }
}

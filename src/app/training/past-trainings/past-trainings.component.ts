import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css'],
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit
{
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  // Here we define Exercise, but MatTableDataSource always expects an
  // array of the type, that we've passed -> here Execise[]:
  dataSource = new MatTableDataSource<Exercise>();
  // private subscriptions: Subscription[] = [];

  // Here we wire-up the sorting and filtering:
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {
    // // Here we populate the dataSource:
    // // Reminder: dataSource expects and array[] of the type, we've set to it!
    // this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();

    this.trainingService.fetchCompletedOrCancelledExercises();
    // const exerciseSub = this.trainingService.finishedExercisesChanged.subscribe(
    this.store.select(fromTraining.getFinishedExercises).subscribe(
      (exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      }
    );

      // this.subscriptions.push(exerciseSub);
  }

  ngAfterViewInit() {
    // Here we wire-up the sorting and filtering:
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // ngOnDestroy() {
  //   if (this.subscriptions.length > 0) {
  //     this.subscriptions.forEach((subscription) => {
  //       subscription.unsubscribe();
  //     });
  //   }
  // }

  doFilter(event: any) {
    const filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

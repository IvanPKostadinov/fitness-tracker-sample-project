import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  // Here we define Exercise, but MatTableDataSource always expects an
  // array of the type, that we've passed -> here Execise[]:
  dataSource = new MatTableDataSource<Exercise>();

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    // Here we populate the dataSource:
    // Reminder: dataSource expects and array[] of the type, we've set to it!
    this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
  }

}

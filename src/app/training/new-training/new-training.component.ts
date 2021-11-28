import { Component, OnInit } from '@angular/core';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();
  exercises: Exercise[] = [];

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    // It's good practice to initialize some services in the ngOnInit():
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining() {
    // this.trainingStart.emit();
    this.trainingService.startExercise();
  }
}

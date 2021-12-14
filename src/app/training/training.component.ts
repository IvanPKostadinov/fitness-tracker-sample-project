import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  subscriptions: Subscription[];

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    const exerciseSub = this.trainingService.exerciseChanged.subscribe(exercise => {
      if (exercise) {
        this.ongoingTraining = true;
      } else {
        this.ongoingTraining = false;
      }
    })

    this.subscriptions.push(exerciseSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }
}

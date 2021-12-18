import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from './training.service';
import * as fromTrainig from './training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean>;
  // subscriptions: Subscription[] = [];

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTrainig.State>
  ) {}

  ngOnInit(): void {
    // const exerciseSub = this.trainingService.exerciseChanged.subscribe(
    //   (exercise) => {
    //     if (exercise) {
    //       this.ongoingTraining = true;
    //     } else {
    //       this.ongoingTraining = false;
    //     }
    //   }
    // );
    // this.subscriptions.push(exerciseSub);
    this.ongoingTraining$ = this.store.select(fromTrainig.getIsTrainig);
  }

  // ngOnDestroy(): void {
  //   if (this.subscriptions.length > 0) {
  //     this.subscriptions.forEach((subscription) => {
  //       subscription.unsubscribe();
  //     });
  //   }
  // }
}

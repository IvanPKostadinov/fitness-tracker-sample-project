import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { UIService } from 'src/app/shared/ui.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  // exercises: Exercise[] = [];
  // We put <any> here because Exercise has an id property:
  exercises: Exercise[];
  private subscriptions: Subscription[] = [];
  // isLoading = true;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
  ) {}

  ngOnInit(): void {
    const exerciseSub = this.trainingService.exercisesChanged.subscribe(exercises => {
      /** Here we get null if an error is thrown in the service */
      this.exercises = exercises;
    });

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // const loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });

    this.fetchExercises();

    this.subscriptions.push(exerciseSub);
  }

  ngOnDestroy() {
    if(this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => {
        sub.unsubscribe();
      })
    }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}

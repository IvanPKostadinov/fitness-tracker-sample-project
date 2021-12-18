import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { UIService } from 'src/app/shared/ui.service';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();
  // exercises: Exercise[] = [];
  // We put <any> here because Exercise has an id property:
  exercises$: Observable<Exercise[]>;
  // private subscriptions: Subscription[] = [];
  // isLoading = true;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromTraining.State>,
  ) {}

  ngOnInit(): void {
      /** Here we get null if an error is thrown in the service */
      this.exercises$ = this.store.select(fromTraining.getAvailableExercises);

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // const loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });

    this.fetchExercises();

    // this.subscriptions.push(exerciseSub);
  }

  // ngOnDestroy() {
  //   if(this.subscriptions.length > 0) {
  //     this.subscriptions.forEach(sub => {
  //       sub.unsubscribe();
  //     })
  //   }
  // }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}

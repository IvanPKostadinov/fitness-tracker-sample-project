import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { UIService } from 'src/app/shared/ui.service';

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
  isLoading = true;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    // private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    // It's good practice to initialize some services in the ngOnInit():
    // this.exercises = this.trainingService.getAvailableExercises();


    const exerciseSub = this.trainingService.exercisesChanged.subscribe(exercises => {
      /** Here we get null if an error is thrown in the service */
      this.exercises = exercises;
    });
    const loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.fetchExercises();

    this.subscriptions.push(exerciseSub, loadingSub);
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
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

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
  exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    // private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    // It's good practice to initialize some services in the ngOnInit():
    // this.exercises = this.trainingService.getAvailableExercises();

    this.exerciseSubscription = this.trainingService.fetchAvailableExercises();
    this.trainingService.exercisesChanged.subscribe(exercises => this.exercises = exercises);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }
}

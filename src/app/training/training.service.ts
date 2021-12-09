import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';

// to be able to inject something in a Service, we need to add @Injectable()
@Injectable({ providedIn: 'root'})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    // Here we use Angularfire to reach out to Firebase:
    // this.exercises = this.db.collection('availableExercises').valueChanges();
    return this.db
      .collection('availableExercises')
      // .snapshotChanges() returns an Observable!
      .snapshotChanges()
      .pipe(
        map((docArray: DocumentChangeAction<any>[]) => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              // With res.payload.doc.data() -> we can extract the data from Firebase!!!
              ...doc.payload.doc.data(),
            }
          })
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    // We pass (with next()) the selected exercise through a Subject and subscribe to it, where we need it:
    // here we pass a copy of the runningExercise:
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }

  private addDataToDatabase(exercise: Exercise) {
    // Here we reach out to a Collection, that doesn't exist
    // -> it will be created automatically
    // .add() returns a Promise!
    this.db.collection('finishedExercises').add(exercise);
  }
}

import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
// import * as fromRoot from '../app.reducer';
import * as fromTraining from './training.reducer';

// to be able to inject something in a Service, we need to add @Injectable()
@Injectable({ providedIn: 'root' })
export class TrainingService {
  // exerciseChanged = new Subject<Exercise>();
  // exercisesChanged = new Subject<Exercise[]>();
  // finishedExercisesChanged = new Subject<Exercise[]>();
  // private availableExercises: Exercise[] = [];
  // private runningExercise: Exercise;
  // private finishedExercises: Exercise[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());

    // Here we use Angularfire to reach out to Firebase:
    // this.exercises = this.db.collection('availableExercises').valueChanges();
    this.subscriptions.push(
      this.db
        .collection('availableExercises')
        // .snapshotChanges() returns an Observable!
        .snapshotChanges()
        .pipe(
          map((docArray: DocumentChangeAction<any>[]) => {
            // throw(new Error());
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                // With res.payload.doc.data() -> we can extract the data from Firebase!!!
                ...doc.payload.doc.data(),
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
            // this.availableExercises = exercises;
            // this.exercisesChanged.next([...this.availableExercises]);

            /** Here we pass a payload -> exercises */
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          (error) => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try again!',
              'Close',
              3000
            );
            /**
             * With passing null, we can show a button in new-training.component to try and fetch the exercises again.
             */
            // this.exerciseChanged.next(null);
          }
        )
    );
  }

  startExercise(selectedId: string) {
    // // // Here we are selecting a single document and updating it with .update():
    // // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    // this.runningExercise = this.availableExercises.find(
    //   (ex) => ex.id === selectedId
    // );
    // // We pass (with next()) the selected exercise through a Subject and subscribe to it, where we need it:
    // // here we pass a copy of the runningExercise:
    // this.exerciseChanged.next({ ...this.runningExercise });

    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    /** We don't want to have an ongoing subscription => take(1) */
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        // ...this.runningExercise,
        ...ex,
        date: new Date(),
        state: 'completed',
      });
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    /** We don't want to have an ongoing subscription => take(1) */
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        // ...this.runningExercise,
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled',
      });
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
    });
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fetchCompletedOrCancelledExercises() {
    // valueChanges gives us an array of elements WITHOUT id:
    this.subscriptions.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          // this.finishedExercisesChanged.next(exercises);
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));

        })
    );
  }

  cancelSubscriptions() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  private addDataToDatabase(exercise: Exercise) {
    // Here we reach out to a Collection, that doesn't exist
    // -> it will be created automatically
    // .add() returns a Promise!
    this.db.collection('finishedExercises').add(exercise);
  }
}

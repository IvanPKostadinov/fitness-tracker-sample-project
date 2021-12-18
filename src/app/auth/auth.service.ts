import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
/** This is the convention - fromRoot */
import * as fromRoot from '../app.reducer';
/** This is the convention - UI -> just the name for Actions */
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private user: User | null;

  // authChange = new Subject<boolean>();
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
  ) {}

  initAuthListener() {
    // This emmits an event whenever the Authentication status changes:
    this.afAuth.authState.subscribe((user) => {
      // user will be null if we are not authenticated:
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.authChange.next(false);
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
        // this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());

    /** We should turn on Authentication in Firebase for this to work! */
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, 'Close', 3000);

        /**
         * The error object has property message, that we can access:
         * duration: 3000 -> will be closed after 3 seconds
         * 'Close' is button with action, to which we can react -> see material.angular.io docs
         */
        // this.snackbar.open(error.message, 'Close', {
        //   duration: 3000,
        // });
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());

    /**
     * Angular Firestore stores a token and sends it with every request.
     * It does this for us, we don't have to do it:
     */
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.authSuccessfully();
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, 'Close', 3000);

        /**
         * The error object has property message, that we can access:
         * duration: 3000 -> will be closed after 3 seconds
         * 'Close' is button with action, to which we can react -> see material.angular.io docs
         */
        // this.snackbar.open(error.message, 'Close', {
        //   duration: 3000,
        // });
      });
  }

  logout() {
    /**
     * We should .unsubscribe on logout because otherwise we have an
     * ongoing subscription and get an error:
     */
    this.afAuth.signOut();
  }


  // isAuth() {
  //   // return this.user != null;
  //   return this.isAuthenticated;
  // }
}

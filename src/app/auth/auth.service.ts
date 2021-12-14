import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  // private user: User | null;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
  ) {}

  initAuthListener() {
    // This emmits an event whenever the Authentication status changes:
    this.afAuth.authState.subscribe((user) => {
      // user will be null if we are not authenticated:
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 1000).toString(),
    // };

    this.uiService.loadingStateChanged.next(true);

    /** We should turn on Authentication in Firebase for this to work! */
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.authSuccessfully();
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
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
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 1000).toString(),
    // };

    this.uiService.loadingStateChanged.next(true);

    /**
     * Angular Firestore stores a token and sends it with every request.
     * It does this for us, we don't have to do it:
     */
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.authSuccessfully();
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
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
    // this.user = null;

    /**
     * We should .unsubscribe on logout because otherwise we have an
     * ongoing subscription and get an error:
     */
    this.afAuth.signOut();
    // this.trainingService.cancelSubscriptions();
    // this.authChange.next(false);
    // this.router.navigate(['/login']);
    // this.isAuthenticated = false;
  }

  /**
   * !!! Here we use the spread operator to return a copy of the user !!!
   */
  // getUser() {
  //   return { ...this.user };
  // }

  isAuth() {
    // return this.user != null;
    return this.isAuthenticated;
  }

  // authSuccessfully() {
  //   this.isAuthenticated = true;
  //   this.authChange.next(true);
  //   this.router.navigate(['/training']);
  // }
}

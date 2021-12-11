import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { TrainingService } from '../training/training.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  // private user: User | null;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService
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

    // We should turn on Authentication in Firebase for this to work!
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 1000).toString(),
    // };

    // Angular Firestore stores a token and sends it with every request.
    // It does this for us, we don't have to do it:
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    // this.user = null;

    // We should .unsubscribe on logout because otherwise we have an
    // ongoing subscription and get an error:
    this.afAuth.signOut();
    // this.trainingService.cancelSubscriptions();
    // this.authChange.next(false);
    // this.router.navigate(['/login']);
    // this.isAuthenticated = false;
  }

  // getUser() {
  //   // !!!
  //   // !!! Here we use the spread operator to return a copy of the user !!!
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

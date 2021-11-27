import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: User;

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString(),
    };
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString(),
    }
  }

  logout() {
    this.user = null;
  }

  getUser() {
    // !!!
    // !!! Here we use the spread operator to return a copy of the user !!!
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }
}


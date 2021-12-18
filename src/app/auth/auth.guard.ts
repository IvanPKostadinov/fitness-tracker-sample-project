import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { pipe } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    // private authService: AuthService,
    // private router: Router,
    private store: Store<fromRoot.State>
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    //   // This line is absent from the course project:
    //   return true;
    // }

    /** take(1) takes one value and closes this subscription */
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad(route: Route) {
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    //   // This line is absent from the course project:
    //   return true;
    // }

    /** take(1) takes one value and closes this subscription */
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}

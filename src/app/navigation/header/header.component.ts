import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    // const sub = this.authService.authChange.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // })

    // this.subscriptions.push(sub)
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  // ngOnDestroy() {
  //   if(this.subscriptions.length > 0) {
  //     this.subscriptions.forEach(subscription => {
  //     subscription.unsubscribe();
  //     })
  //   }
  // }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from 'src/app/auth/auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  // subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    // const sub = this.authService.authChange.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // });

    // this.subscriptions.push(sub);
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  // ngOnDestroy() {
  //   if(this.subscriptions.length > 0) {
  //     this.subscriptions.forEach(subscription => {
  //       subscription.unsubscribe();
  //     })
  //   }
  // }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}

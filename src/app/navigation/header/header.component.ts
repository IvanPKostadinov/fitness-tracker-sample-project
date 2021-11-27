import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  subscriptions: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscriptions = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}

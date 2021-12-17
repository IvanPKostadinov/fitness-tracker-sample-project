import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  maxDate: Date;
  // isLoading = false;
  isLoading$: Observable<boolean>;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // const loadingSub = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    // this.subscriptions.push(loadingSub);
  }

  onSubmit(form: NgForm) {
    // console.log(form);
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }
}

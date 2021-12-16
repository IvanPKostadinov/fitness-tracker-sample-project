import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // isLoading = false;
  /** !!! By convention variable, controlled by NgRx, ends with a $ sign !!! */
  isLoading$: Observable<boolean>;
  private subscriptions: Subscription[] = [];
  private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
  ) {}

  ngOnInit(): void {
    /** We use the map() operator from rxjs */
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.store.subscribe(data => console.log(data));

    // const loadingSub = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    // this.subscriptions.push(loadingSub);
  }

  // ngOnDestroy(): void {
  //   if (this.subscriptions.length > 0) {
  //     this.subscriptions.forEach((subscription) => {
  //       subscription.unsubscribe();
  //     });
  //   }
  // }

  onSubmit() {
    // console.log(this.loginForm);
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }
}

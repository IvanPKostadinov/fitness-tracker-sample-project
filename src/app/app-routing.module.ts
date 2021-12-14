import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  /**
   * !!! We implement Lazy Loading with loadChildren !!!
   * canLoad works in a similar way like canActivate, but it runs before the bunle is loaded (implement canLoad in AuthGuard)
   * -> we use it here, instead of canActivate in training-routing.module
   */
  {
    path: 'training',
    loadChildren: () => import('./training/training.module').then(
        (module) => module.TrainingModule
      ),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}

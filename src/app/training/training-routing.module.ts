import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { TrainingComponent } from './training.component';

const routes: Routes = [
  /** Here we remove 'training' to implement Lazy Loading with loadChildren in app-routing.module */
  // { path: 'training', component: TrainingComponent, canActivate: [AuthGuard] },
  { path: '', component: TrainingComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}

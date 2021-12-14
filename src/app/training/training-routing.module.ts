import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrainingComponent } from './training.component';

const routes: Routes = [
  /**
   *  Here we remove 'training' to implement Lazy Loading with loadChildren in app-routing.module
   *  We also remove canActivate, because it's too late to check here - we've already loaded the Module
   */
  // { path: 'training', component: TrainingComponent, canActivate: [AuthGuard] },
  { path: '', component: TrainingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}

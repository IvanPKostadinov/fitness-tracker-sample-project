import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  templateUrl: './stop-training.component.html',
})
export class StopTrainingComponent {
  // This is how we access data from the parent component:
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();
  // exercises: Exercise[] = [];
  // We put <any> here because Exercise has an id property:
  exercises: Observable<any>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    // It's good practice to initialize some services in the ngOnInit():
    // this.exercises = this.trainingService.getAvailableExercises();

    // Here we use Angularfire to reach out to Firebase:
    this.exercises = this.db.collection('availableExercises').valueChanges();
    // .subscribe((result) => {
    //   console.log(result)
    // });
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }
}

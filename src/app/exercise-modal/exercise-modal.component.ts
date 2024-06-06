import {Component, Inject, Input, OnInit} from '@angular/core';
import { Exercise } from "../Models/Exercise";
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.component.html',
  styleUrls: ['./exercise-modal.component.css']
})
export class ExerciseModalComponent implements OnInit{

  ngOnInit() {

  }
  constructor(@Inject(MAT_DIALOG_DATA) public exercise: Exercise,public dialogRef: MatDialogRef<ExerciseModalComponent>) {}
  closeModal(): void {
    this.dialogRef.close();
  }
}

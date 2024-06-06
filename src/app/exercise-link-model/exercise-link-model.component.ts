import {Component, Inject, Input, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var FB: any;

@Component({
  selector: 'app-exercise-link-model',
  templateUrl: './exercise-link-model.component.html',
  styleUrls: ['./exercise-link-model.component.css']
})
export class ExerciseLinkModelComponent implements OnInit {
  @Input() exerciseLink: string = '';


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ExerciseLinkModelComponent>
  ) { }

  ngOnInit(): void {
    this.exerciseLink=this.data.exerciseLink;
  }

  shareOnFacebook() {
    // Get the exercise ID from the exercise link
    const exerciseId = this.exerciseLink.split('/').pop();

    // Construct the ngrok URL with the exercise ID
    const ngrokUrl = ' https://9b52-196-203-207-178.ngrok-free.app/';
    // Replace with your ngrok URL
    const exerciseUrl = `${ngrokUrl}exercises/${exerciseId}`;
    console.log('Exercise URL:', exerciseUrl);
    // Construct the Facebook share URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(exerciseUrl)}`;

    // Open the Facebook share URL in a new tab
    window.open(facebookShareUrl, '_blank');
  }


  copyLink(): void {
    navigator.clipboard.writeText(this.exerciseLink)
      .then(() => {
        console.log('Exercise link copied to clipboard:', this.exerciseLink);
        // Optionally, you can show a success message to the user
        this.dialogRef.close();
      })
      .catch(error => {
        console.error('Error copying exercise link to clipboard:', error);
        // Optionally, you can show an error message to the user
        this.dialogRef.close();
      });
  }
}

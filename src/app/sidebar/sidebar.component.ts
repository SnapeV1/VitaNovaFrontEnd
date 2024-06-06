import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Commandeline } from '../ModelProduct/Commandeline';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  commandelines: Commandeline[] = [];
  @Output() productDeleted = new EventEmitter<number>(); // Define an event emitter to notify the parent component

  constructor(
    public dialogRef: MatDialogRef<SidebarComponent>, // Inject MatDialogRef
    @Inject(MatDialogRef) private data: { commandelines: Commandeline[] } // Access data passed from dialog opening
  ) { } // Optional injection (if needed)

  ngOnInit() {
    this.commandelines = this.data.commandelines || []; // Use data from dialog opening or empty array
  }

  closeSidebar() {
    this.dialogRef.close();
  }
  deleteProduct(productId: number) {
    // Delete the product from the sidebar
    this.productDeleted.emit(productId); // Emit the event with the product ID
  }
}

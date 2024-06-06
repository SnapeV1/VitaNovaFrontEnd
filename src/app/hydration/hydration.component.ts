import { Component } from '@angular/core';

@Component({
  selector: 'app-hydration',
  templateUrl: './hydration.component.html',
  styleUrls: ['./hydration.component.css']
})
export class HydrationComponent {
  glasses = [
    { id: 1, filled: false },
    { id: 2, filled: false },
    { id: 3, filled: false },
    { id: 4, filled: false }
  ];

  toggleWater(glass): void {
    // Toggle water level of the clicked glass
    glass.filled = !glass.filled;
  }
}

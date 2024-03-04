import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  @Output() change = new EventEmitter<boolean>();

  onChange(checked: boolean) {
    this.change.emit(checked);
  }
}

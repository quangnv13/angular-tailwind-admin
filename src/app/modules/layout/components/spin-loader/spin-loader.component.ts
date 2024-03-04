import { Component, Input } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { SpinLoaderService } from 'src/app/core/services/spin-loader.service';

@Component({
  selector: 'app-spin-loader',
  standalone: true,
  imports: [],
  templateUrl: './spin-loader.component.html',
  styleUrl: './spin-loader.component.scss',
  animations: [trigger('spin', [transition(':enter', animate('1s infinite', style({ transform: 'rotate(360deg)' })))])],
})
export class SpinLoaderComponent {
  isLoading: boolean = false;
  constructor(private loaderService: SpinLoaderService) {}

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}

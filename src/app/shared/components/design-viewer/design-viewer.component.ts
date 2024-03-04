import { Component, Input, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-design-viewer',
  standalone: true,
  imports: [],
  templateUrl: './design-viewer.component.html',
  styleUrl: './design-viewer.component.scss',
})
export class DesignViewerComponent implements OnInit {
  @Input() data!: { version: string; objects: fabric.Object[] };
  designCanvas: fabric.Canvas = new fabric.Canvas('design-canvas');

  ngOnInit(): void {}
}

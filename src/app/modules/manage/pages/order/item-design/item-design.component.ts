import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { SpinLoaderService } from 'src/app/core/services/spin-loader.service';
import { downloadBlob } from 'src/app/core/utils/utils';
import { SpinLoaderComponent } from 'src/app/modules/layout/components/spin-loader/spin-loader.component';
import { ProductDesignData } from 'src/app/shared/models/product-design';
import { FormatCurrencyPipe } from 'src/app/shared/pipes/format-currency.pipe';

@Component({
  selector: 'app-item-design',
  standalone: true,
  imports: [SpinLoaderComponent, FormatCurrencyPipe],
  templateUrl: './item-design.component.html',
  styleUrl: './item-design.component.scss',
})
export class ItemDesignComponent implements OnInit, AfterViewInit {
  @Input() designs!: ProductDesignData[];
  @Input() name!: string;
  @Input() dropshipPrice!: number;
  @Input() printPrice!: number;
  frontDesign!: fabric.Canvas;
  backDesign!: fabric.Canvas;
  downloadDesignWorker = new Worker(
    new URL('../../../../../core/workers/download-base64-image.worker.ts', import.meta.url),
    { type: 'module' },
  );

  DATA_URL_OPTIONS = {
    format: 'png',
    enableRetinaScaling: true,
    quality: 1,
  };

  PRINTABLE_W = 180;
  PRINTABLE_H = 380;
  constructor(private spinLoaderService: SpinLoaderService) {
    this.downloadDesignWorker.onmessage = ({ data }) => {
      const { blob, filename } = data;
      downloadBlob(blob, filename);
    };
  }

  ngOnInit(): void {
    this.frontDesign = new fabric.Canvas('front-design');
    this.backDesign = new fabric.Canvas('back-design');
  }

  ngAfterViewInit(): void {
    this.frontDesign.loadFromJSON(JSON.parse(this.designs[0].designData), () => {
      this.frontDesign.renderAll();
    });

    this.backDesign.loadFromJSON(JSON.parse(this.designs[1].designData), () => {
      this.backDesign.renderAll();
    });
  }

  toDataURLAsync(canvas: fabric.Canvas, options: fabric.IDataURLOptions): Promise<string> {
    const backgroundImage = canvas.backgroundImage;
    return new Promise((resolve, reject) => {
      if (typeof canvas.toDataURL === 'function') {
        try {
          canvas.setBackgroundImage(new fabric.Image(''), () => {
            canvas.renderAll();
            const dataUrl = canvas.toDataURL(options);
            canvas.setBackgroundImage(backgroundImage!, () => canvas.renderAll());
            resolve(dataUrl);
          });
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('toDataURL method is not available on the provided canvas object.'));
      }
    });
  }

  downloadImage(type: 'front' | 'back') {
    const printableArea = this.backDesign.getObjects('rect')[0];
    const options = {
      ...this.DATA_URL_OPTIONS,
      multiplier: 20,
      left: printableArea.left,
      top: printableArea.top,
      width: printableArea.width,
      height: printableArea.height,
    };
    if (type === 'front') {
      this.toDataURLAsync(this.frontDesign, options).then((dataUrl) => {
        this.downloadDesignWorker.postMessage({
          dataUrl,
          filename: `${this.name}_${type}.png`,
        });
      });
    } else {
      this.toDataURLAsync(this.backDesign, options).then((dataUrl) => {
        this.downloadDesignWorker.postMessage({
          dataUrl,
          filename: `${this.name}_${type}.png`,
        });
      });
    }
  }
}

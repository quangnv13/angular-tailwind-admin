import { Component, ViewChild, ViewContainerRef, ComponentRef, Type, Injector } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { DIALOG_DATA } from './dialog.service';

@Component({
  selector: 'app-dialog-wrapper',
  template: `
    <div class="dialog-overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div class="dialog-container bg-white rounded-lg shadow-xl max-w-[90vw] max-h-[85vh] mx-auto p-6 space-y-4 relative overflow-auto">
        <button (click)="close()" class="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
          <i class="fas fa-times"></i>
        </button>
        <ng-container #dynamicContent></ng-container>
      </div>
    </div>
  `
})
export class DialogWrapperComponent {
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true }) dynamicContentContainer!: ViewContainerRef;

  private overlayRef!: OverlayRef;
  private componentRef!: ComponentRef<any>;

  constructor() {}

  setOverlayRef(overlayRef: OverlayRef) {
    this.overlayRef = overlayRef;
  }

  attachComponent<T>(component: Type<T>, injector: Injector) {
    this.componentRef = this.dynamicContentContainer.createComponent(component, { injector });
    this.componentRef.instance.data = injector.get(DIALOG_DATA, null);
  }

  close() {
    this.overlayRef.dispose();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}

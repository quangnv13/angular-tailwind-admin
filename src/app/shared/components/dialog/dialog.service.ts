import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { DialogWrapperComponent } from './dialog.component';

export type DialogData<T> = {
  data: T;
  close: (result?: boolean) => void;
};

export const DIALOG_DATA = new InjectionToken<any>('DIALOG_DATA');

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private overlay: Overlay, private parentInjector: Injector) {}

  open<T, D>(component: Type<T>, config: OverlayConfig, data?: D): OverlayRef {
    const overlayRef = this.overlay.create(config);

    const customInjector = Injector.create({
      providers: [{ provide: DIALOG_DATA, useValue: data }],
      parent: this.parentInjector,
    });

    const wrapperComponentRef = overlayRef.attach(new ComponentPortal(DialogWrapperComponent, null, customInjector));
    const wrapperInstance = wrapperComponentRef.instance as DialogWrapperComponent;
    wrapperInstance.setOverlayRef(overlayRef);
    wrapperInstance.attachComponent(component, customInjector);

    return overlayRef;
  }
}

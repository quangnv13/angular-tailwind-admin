import { enableProdMode, importProvidersFrom } from '@angular/core';

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';

fetch(`assets/config.json?${new Date().getTime()}`)
  .then((response) => response.json())
  .then((data: { backendBaseApiUrl: string }) => {
    if (environment.production) {
      enableProdMode();
      if (window) {
        selfXSSWarning();
      }
    }
    window.backendBaseApiUrl = data.backendBaseApiUrl;
    bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
  });

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;',
    );
    console.log(
      `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
      'font-weight:bold; font: 2em Arial; color: #e11d48;',
    );
  });
}

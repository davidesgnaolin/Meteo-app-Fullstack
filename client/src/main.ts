import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <--- Cambiato da { App } a { AppComponent }

bootstrapApplication(AppComponent, appConfig) // <--- Cambiato anche qui
  .catch((err) => console.error(err));

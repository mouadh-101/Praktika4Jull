<<<<<<< HEAD
=======
// src/polyfills.ts
(window as any).global = window;

/// <reference types="@angular/localize" />

>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

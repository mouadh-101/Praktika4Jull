
// src/polyfills.ts
(window as any).global = window;

/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmtCe0x3Q3xbf1x1ZFRGal9XTnVdUj0eQnxTdEBjXX5YcnZWQWVbVUN+W0lfag==');
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  
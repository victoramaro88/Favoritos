import { routes } from './app.routes';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import MyPreset from '../PrimeNgConfigStyle/mypreset';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([BrowserAnimationsModule]),
    providePrimeNG({
      theme: {
        // preset: Aura,
        preset: MyPreset,

        options: {
          prefix: 'p',
          darkModeSelector: true || 'none',
          cssLayer: false,
        },
      },
    }),
  ],
};

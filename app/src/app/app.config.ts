import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, UrlSerializer, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { TrailingSlashUrlSerializer } from './trailing-slash-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
  ],
};

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, Router, UrlSerializer, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { TrailingSlashUrlSerializer } from './trailing-slash-url-serializer';

describe('TrailingSlashUrlSerializer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideLocationMocks(),
        provideHttpClient(),
        { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
      ],
    });
  });

  // GitHub Pages serves prerendered post pages at their directory URL, so the
  // trailing-slash form has to resolve to the same route as the bare one.
  for (const url of [
    '/posts/agentic-coding',
    '/posts/agentic-coding/',
    '/',
    '/posts/agentic-coding/?a=1',
  ]) {
    it(`matches a route for ${JSON.stringify(url)}`, async () => {
      const router = TestBed.inject(Router);
      await expect(router.navigateByUrl(url)).resolves.toBe(true);
    });
  }
});

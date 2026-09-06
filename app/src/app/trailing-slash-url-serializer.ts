import { DefaultUrlSerializer, UrlTree } from '@angular/router';

// Each prerendered route is emitted as a directory index (posts/<id>/index.html),
// so GitHub Pages serves post pages at a trailing-slash URL. The default
// serializer parses that trailing slash into an extra empty segment, which
// `posts/:id` cannot match (NG04002), leaving direct visitors on a broken page.
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    return super.parse(url.replace(/\/+(?=$|[?#])/, '') || '/');
  }
}

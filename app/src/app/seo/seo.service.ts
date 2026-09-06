import { DOCUMENT, inject, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_NAME = "Markus' Blog";
const SITE_ORIGIN = 'https://mgeipel.github.io';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/markus.png`;
const AUTHOR_NAME = 'Markus Geipel';

export interface WebsiteSeo {
  description: string;
}

export interface ArticleSeo {
  id: string;
  title: string;
  description: string;
  datePublished: string;
}

@Service()
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setWebsite(seo: WebsiteSeo): void {
    const url = `${SITE_ORIGIN}/`;
    this.applyCommonTags({
      documentTitle: SITE_NAME,
      title: SITE_NAME,
      description: seo.description,
      url,
      type: 'website',
    });
    this.meta.removeTag('property="article:published_time"');
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: SITE_NAME,
      description: seo.description,
      url,
      author: { '@type': 'Person', name: AUTHOR_NAME },
    });
  }

  setArticle(seo: ArticleSeo): void {
    // Trailing slash: each post is prerendered as posts/<id>/index.html, so this
    // is the URL GitHub Pages serves directly instead of redirecting to.
    const url = `${SITE_ORIGIN}/posts/${seo.id}/`;
    this.applyCommonTags({
      documentTitle: `${seo.title} · ${SITE_NAME}`,
      title: seo.title,
      description: seo.description,
      url,
      type: 'article',
    });
    this.meta.updateTag({ property: 'article:published_time', content: seo.datePublished });
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: seo.title,
      description: seo.description,
      datePublished: seo.datePublished,
      author: { '@type': 'Person', name: AUTHOR_NAME },
      url,
      image: DEFAULT_IMAGE,
    });
  }

  private applyCommonTags(opts: {
    documentTitle: string;
    title: string;
    description: string;
    url: string;
    type: 'website' | 'article';
  }): void {
    this.title.setTitle(opts.documentTitle);
    this.meta.updateTag({ name: 'description', content: opts.description });
    this.meta.updateTag({ name: 'author', content: AUTHOR_NAME });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: opts.type });
    this.meta.updateTag({ property: 'og:title', content: opts.title });
    this.meta.updateTag({ property: 'og:description', content: opts.description });
    this.meta.updateTag({ property: 'og:url', content: opts.url });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_IMAGE });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: opts.title });
    this.meta.updateTag({ name: 'twitter:description', content: opts.description });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_IMAGE });
    this.setCanonical(opts.url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: Record<string, unknown>): void {
    let script = this.document.head.querySelector<HTMLScriptElement>('script[data-seo="jsonld"]');
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', 'jsonld');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}

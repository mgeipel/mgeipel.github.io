import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import katex from 'katex';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail {
  private readonly postsService = inject(PostsService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly id = input.required<string>();

  protected readonly post = computed(() => this.postsService.getPost(this.id()));

  private readonly contentResource = httpResource.text(() => {
    const contentUrl = this.post()?.contentUrl;
    return contentUrl && contentUrl !== '#' ? contentUrl : undefined;
  });

  protected readonly content = computed(() => {
    const html = this.contentResource.value();
    return html ? this.sanitizer.bypassSecurityTrustHtml(html) : undefined;
  });

  private readonly contentEl = viewChild<ElementRef<HTMLElement>>('contentEl');
  private readonly lightbox = viewChild<ElementRef<HTMLDialogElement>>('lightbox');

  protected readonly lightboxContent = signal<SafeHtml | null>(null);

  constructor() {
    // The article body is rendered via [innerHTML], so its diagrams aren't
    // real Angular elements — make them focusable/announced as buttons once
    // they land in the DOM, so the lightbox is reachable by keyboard too.
    afterRenderEffect(() => {
      for (const media of this.contentEl()?.nativeElement.querySelectorAll<HTMLElement>(
        'figure.tex-marginfigure svg, figure.tex-marginfigure img',
      ) ?? []) {
        media.setAttribute('tabindex', '0');
        media.setAttribute('role', 'button');
        media.setAttribute(
          'aria-label',
          media instanceof HTMLImageElement ? `Enlarge image: ${media.alt}` : 'Enlarge diagram',
        );
      }
      for (const math of this.contentEl()?.nativeElement.querySelectorAll<HTMLElement>(
        'span.tex-math',
      ) ?? []) {
        this.renderMath(math);
      }
    });
  }

  // The LaTeX-to-HTML conversion leaves math as raw source (e.g. "\(F = Gm_1m_2/r^2\)")
  // wrapped in a span instead of pre-rendered — render it client-side with KaTeX.
  private renderMath(el: HTMLElement): void {
    if (el.querySelector('.katex')) {
      return;
    }
    const source = (el.textContent ?? '').trim();
    const displayMode = source.startsWith('\\[') && source.endsWith('\\]');
    const inline = source.startsWith('\\(') && source.endsWith('\\)');
    const expression = displayMode || inline ? source.slice(2, -2) : source;
    katex.render(expression, el, { throwOnError: false, displayMode });
  }

  // The article body is rendered via [innerHTML], so its elements aren't part
  // of Angular's template and can't bind (click)/(keydown) individually —
  // delegate from the wrapping div instead.
  protected onContentClick(event: MouseEvent): void {
    const target = event.target as Element;
    if (this.tryOpenLightbox(target)) {
      return;
    }
    this.tryScrollToAnchor(target, event);
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    if (this.tryOpenLightbox(event.target as Element)) {
      event.preventDefault();
    }
  }

  protected onLightboxClick(event: MouseEvent): void {
    if (event.target === this.lightbox()?.nativeElement) {
      this.lightbox()?.nativeElement.close();
    }
  }

  protected onLightboxClose(): void {
    this.lightboxContent.set(null);
  }

  // The article's cross-reference links are plain "#id" anchors from the
  // LaTeX conversion. With the app's `<base href="/">`, the browser would
  // resolve those against the base URL instead of the current route,
  // sending readers back to "/#id" (the post list) — so we scroll manually.
  private tryScrollToAnchor(target: Element, event: MouseEvent): boolean {
    const anchor = target.closest('a[href^="#"]');
    if (!anchor) {
      return false;
    }
    const id = anchor.getAttribute('href')!.slice(1);
    const heading = this.contentEl()?.nativeElement.querySelector(`#${CSS.escape(id)}`);
    if (!heading) {
      return false;
    }
    event.preventDefault();
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // `history.pushState` resolves a bare "#id" string against the document's
    // *base* URL too, so build the target from `location.href` instead to
    // keep the current pathname intact.
    const url = new URL(location.href);
    url.hash = id;
    history.pushState(history.state, '', url);
    return true;
  }

  private tryOpenLightbox(target: Element): boolean {
    const media = target.closest('figure.tex-marginfigure svg, figure.tex-marginfigure img');
    if (!media) {
      return false;
    }
    this.lightboxContent.set(this.sanitizer.bypassSecurityTrustHtml(media.outerHTML));
    this.lightbox()?.nativeElement.showModal();
    return true;
  }
}

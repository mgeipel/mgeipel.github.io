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
      for (const svg of this.contentEl()?.nativeElement.querySelectorAll('figure.tex-marginfigure svg') ?? []) {
        svg.setAttribute('tabindex', '0');
        svg.setAttribute('role', 'button');
        svg.setAttribute('aria-label', 'Enlarge diagram');
      }
    });
  }

  // The article body is rendered via [innerHTML], so its elements aren't part
  // of Angular's template and can't bind (click)/(keydown) individually —
  // delegate from the wrapping div instead.
  protected onContentClick(event: MouseEvent): void {
    this.tryOpenLightbox(event.target as Element);
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

  private tryOpenLightbox(target: Element): boolean {
    const svg = target.closest('svg');
    if (!svg || !svg.closest('figure.tex-marginfigure')) {
      return false;
    }
    this.lightboxContent.set(this.sanitizer.bypassSecurityTrustHtml(svg.outerHTML));
    this.lightbox()?.nativeElement.showModal();
    return true;
  }
}

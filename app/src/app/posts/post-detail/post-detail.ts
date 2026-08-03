import { Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
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
}

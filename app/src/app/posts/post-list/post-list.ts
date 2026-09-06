import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../posts.service';
import { SeoService } from '../../seo/seo.service';

@Component({
  selector: 'app-post-list',
  imports: [RouterLink],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList {
  private readonly postsService = inject(PostsService);
  private readonly seo = inject(SeoService);

  protected readonly posts = this.postsService.allPosts;

  constructor() {
    this.seo.setWebsite({
      description:
        'Notes on machine learning, data science, and agentic software development by Markus Geipel.',
    });
  }
}
